"use client";

import { Camera, ImageIcon, Loader2, Sparkles, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useGetCategories } from "@/modules/studio/manage-agents/categories/services/getCategories";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

import type { UserAgent } from "../types";
import type { KeyboardEvent } from "react";

interface GeneralTabProps {
  agent: UserAgent;
  iconFile: File | null;
  setIconFile: (file: File | null) => void;
  coverFile: File | null;
  setCoverFile: (file: File | null) => void;
  onSave: (data: Record<string, string | boolean | number | undefined | string[]>) => void;
  isPending: boolean;
  onDelete: () => void;
  isDeleting: boolean;
  confirmDelete: boolean;
  setConfirmDelete: (v: boolean) => void;
}

export const GeneralTab = ({
  agent,
  iconFile,
  setIconFile,
  coverFile,
  setCoverFile,
  onSave,
  isPending,
  onDelete,
  isDeleting,
  confirmDelete,
  setConfirmDelete,
}: GeneralTabProps) => {
  const { t } = useTranslation();
  const iconInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(agent.name || "");
  const [description, setDescription] = useState(agent.description || "");
  const [shortDescription, setShortDescription] = useState(agent.shortDescription || "");
  const [longDescription, setLongDescription] = useState(agent.longDescription || "");
  const [welcomeMessage, setWelcomeMessage] = useState(agent.welcomeMessage || "");
  const [demoUrl, setDemoUrl] = useState(agent.demoUrl || "");
  const [category, setCategory] = useState<string>(
    (agent as UserAgent & { category?: number }).category?.toString() || ""
  );
  const [tags, setTags] = useState<string[]>(Array.isArray(agent.tags) ? agent.tags : []);
  const [tagInput, setTagInput] = useState<string>("");
  const [iconRemoved, setIconRemoved] = useState(false);
  const [coverRemoved, setCoverRemoved] = useState(false);

  // Fetch categories
  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategories();

  // Preview URLs — respect explicit removal
  const iconPreview = iconFile ? URL.createObjectURL(iconFile) : iconRemoved ? null : agent.iconUrl;
  const coverPreview = coverFile
    ? URL.createObjectURL(coverFile)
    : coverRemoved
    ? null
    : agent.coverImageUrl;

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      setIconRemoved(false);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverRemoved(false);
    }
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Record<string, string | boolean | number | undefined | string[]> = {
      name,
      description,
      shortDescription,
      longDescription,
      welcomeMessage,
      demoUrl,
      iconRemoved,
      coverRemoved,
      tags,
    };

    // Only add category if it's selected
    if (category) {
      data.category = parseInt(category, 10);
    }

    onSave(data);
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="mb-2">
        <h2 className="text-3xl font-black tracking-tight text-foreground mb-1">
          {t("pages.agent_settings.general.title")}
        </h2>
        <p className="text-muted-foreground text-[0.9375rem]">
          {t("pages.agent_settings.general.description")}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        {/* ─── Cover Image ─── */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {t("pages.agent_settings.general.cover_image")}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {t("pages.agent_settings.general.cover_description")}
          </p>
          <div className="relative w-full h-48 rounded-2xl border-2 border-dashed border-border bg-muted/30 overflow-hidden group transition-colors hover:border-primary/40">
            {coverPreview ? (
              <>
                <Image src={coverPreview} alt="Cover" fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="gap-1.5"
                    onClick={() => coverInputRef.current?.click()}
                  >
                    <Camera size={14} />
                    {t("pages.agent_settings.general.change")}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="gap-1.5"
                    onClick={() => {
                      setCoverFile(null);
                      setCoverRemoved(true);
                    }}
                  >
                    <X size={14} />
                    {t("pages.agent_settings.general.remove")}
                  </Button>
                </div>
              </>
            ) : (
              <button
                type="button"
                className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer bg-transparent border-none"
                onClick={() => coverInputRef.current?.click()}
              >
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                  <ImageIcon size={24} />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {t("pages.agent_settings.general.upload_cover")}
                </span>
                <span className="text-xs text-muted-foreground/60">
                  {t("pages.agent_settings.general.recommended_cover")}
                </span>
              </button>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
          </div>
        </div>

        {/* ─── Icon ─── */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {t("pages.agent_settings.general.agent_icon")}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {t("pages.agent_settings.general.icon_description")}
          </p>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-border bg-muted/30 overflow-hidden group shrink-0 transition-colors hover:border-primary/40">
              {iconPreview ? (
                <>
                  <Image src={iconPreview} alt="Icon" fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera
                      size={18}
                      className="text-white cursor-pointer"
                      onClick={() => iconInputRef.current?.click()}
                    />
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  className="w-full h-full flex items-center justify-center cursor-pointer bg-transparent border-none"
                  onClick={() => iconInputRef.current?.click()}
                >
                  <Sparkles size={28} className="text-muted-foreground" />
                </button>
              )}
              <input
                ref={iconInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleIconChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => iconInputRef.current?.click()}
                >
                  <Upload size={14} />
                  Upload Icon
                </Button>
                {(iconFile || agent.iconUrl) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5 border-destructive text-destructive hover:bg-destructive hover:text-white"
                    onClick={() => {
                      setIconFile(null);
                      setConfirmDelete(false);
                    }}
                  >
                    <X size={14} />
                    {t("pages.agent_settings.general.remove")}
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground/60">
                {t("pages.agent_settings.general.recommended_icon")}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Agent Details ─── */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {t("pages.agent_settings.general.details_title")}
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            {t("pages.agent_settings.general.details_description")}
          </p>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="agent-name" className="mb-1.5 block">
                {t("pages.agent_settings.general.name")}
              </Label>
              <Input
                id="agent-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Support Agent"
              />
            </div>

            <div>
              <Label htmlFor="agent-category" className="mb-1.5 block">
                {t("pages.agent_settings.general.category")}
              </Label>
              <Select value={category} onValueChange={setCategory} disabled={isLoadingCategories}>
                <SelectTrigger id="agent-category">
                  <SelectValue
                    placeholder={
                      isLoadingCategories
                        ? t("pages.agent_settings.general.loading_categories")
                        : t("pages.agent_settings.general.select_category")
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat: { id: number; name: string }) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="tags" className="mb-1.5 block">
                {t("pages.agent_settings.general.tags")}
              </Label>
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press Enter"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                {t("pages.agent_settings.general.tags_description")}
              </p>
              {Array.isArray(tags) && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="pl-3 pr-2 py-1.5 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1.5 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="demo-url" className="mb-1.5 block">
                {t("pages.agent_settings.general.demo_url")}
              </Label>
              <Input
                id="demo-url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://example.com/demo"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="short-desc" className="mb-1.5 block">
                {t("pages.agent_settings.general.short_desc")}
              </Label>
              <Input
                id="short-desc"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="A brief one-liner about your agent"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description" className="mb-1.5 block">
                {t("pages.agent_settings.general.long_desc")}
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does your agent do?"
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="long-desc" className="mb-1.5 block">
                {t("pages.agent_settings.general.long_desc")}
              </Label>
              <Textarea
                id="long-desc"
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                placeholder="A detailed description of capabilities, use cases, and features."
                rows={5}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="welcome-msg" className="mb-1.5 block">
                {t("pages.agent_settings.general.welcome_msg")}
              </Label>
              <Textarea
                id="welcome-msg"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                placeholder="Hello! How can I help you today?"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* ─── Actions ─── */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="submit" disabled={isPending} className="gap-1.5">
            {isPending && <Loader2 size={14} className="animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>

      {/* ─── Danger Zone ─── */}
      <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h3 className="text-base font-semibold text-foreground mb-0.5">Delete this agent</h3>
            <p className="text-sm text-muted-foreground">
              Permanently remove this agent and all associated data. This cannot be undone.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {confirmDelete ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmDelete(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1.5"
                  disabled={isDeleting}
                  onClick={() => {
                    onDelete();
                    setConfirmDelete(false);
                  }}
                >
                  {isDeleting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Yes, delete
                </Button>
              </>
            ) : (
              <Button
                variant="destructive"
                size="sm"
                className="gap-1.5"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 size={14} /> Delete Agent
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
