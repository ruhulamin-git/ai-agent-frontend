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

import {
  AdvancedSettingsSection,
  AutoReplyConfigSection,
  ChatConfigSection,
  EventConfigSection,
  TaskConfigSection,
} from "./GeneralTabFormSections";

import type { ExternalAgent, TriggerType } from "../types";
import type { ExternalAgentGeneralFormValues } from "./types";

interface GeneralTabProps {
  agent: ExternalAgent;
  iconFile: File | null;
  setIconFile: (file: File | null) => void;
  coverFile: File | null;
  setCoverFile: (file: File | null) => void;
  onSave: (data: ExternalAgentGeneralFormValues) => void;
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

  const [name, setName] = useState(agent.agent?.name || "");
  const [siteUrl, setSiteUrl] = useState(agent.siteUrl || "");
  const [authMethod, setAuthMethod] = useState(agent.authMethod || "api_key");
  const [executionMode, setExecutionMode] = useState(agent.executionMode || "redirect");
  const [interactionMode, setInteractionMode] = useState(agent.agent?.interactionMode || "chat");
  const [documentationUrl, setDocumentationUrl] = useState(agent.documentationUrl || "");
  const [rateLimitPerMinute, setRateLimitPerMinute] = useState(
    agent.rateLimitPerMinute?.toString() || "60"
  );
  const [timeoutSeconds, setTimeoutSeconds] = useState(agent.timeoutSeconds?.toString() || "30");

  // Category and Tags
  const [category, setCategory] = useState<string>(agent.agent?.category?.toString() || "");
  const [tags, setTags] = useState<string[]>(
    Array.isArray(agent.agent?.tags) ? agent.agent.tags : []
  );
  const [tagInput, setTagInput] = useState<string>("");

  // Additional agent metadata
  const [description, setDescription] = useState(agent.agent?.description || "");
  const [shortDescription, setShortDescription] = useState(agent.agent?.shortDescription || "");
  const [longDescription, setLongDescription] = useState(agent.agent?.longDescription || "");
  const [welcomeMessage, setWelcomeMessage] = useState(agent.agent?.welcomeMessage || "");
  const [demoUrl, setDemoUrl] = useState(agent.agent?.demoUrl || "");

  // Fetch categories
  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategories();

  // Chat mode fields
  const [chatFrontendUrl, setChatFrontendUrl] = useState(agent.chatFrontendUrl || "");
  const [chatApiEndpoint, setChatApiEndpoint] = useState(agent.chatApiEndpoint || "");
  const [supportsStreaming, setSupportsStreaming] = useState(agent.supportsStreaming || false);
  const [chatApiRequestFormat, setChatApiRequestFormat] = useState(
    JSON.stringify(agent.chatApiRequestFormat || {}, null, 2)
  );
  const [chatApiResponseFormat, setChatApiResponseFormat] = useState(
    JSON.stringify(agent.chatApiResponseFormat || {}, null, 2)
  );

  // Task mode fields
  const [executeEndpoint, setExecuteEndpoint] = useState(agent.executeEndpoint || "");
  const [outputFormat, setOutputFormat] = useState(agent.outputFormat || "json");
  const [isAsyncExecution, setIsAsyncExecution] = useState(agent.isAsyncExecution || false);
  const [callbackUrl, setCallbackUrl] = useState(
    ((agent as unknown as Record<string, unknown>).callbackUrl as string) || ""
  );
  const [inputSchema, setInputSchema] = useState(JSON.stringify(agent.inputSchema || {}, null, 2));

  // Auto-reply mode fields
  const [replyEndpoint, setReplyEndpoint] = useState(agent.replyEndpoint || "");
  const [supportedPlatforms, setSupportedPlatforms] = useState<string[]>(
    agent.supportedPlatforms || []
  );

  // Event mode fields
  const [eventEndpoint, setEventEndpoint] = useState(agent.eventEndpoint || "");
  const [triggerType, setTriggerType] = useState<TriggerType | "">(agent.triggerType || "");
  const [supportedEvents, setSupportedEvents] = useState<string[]>(agent.supportedEvents || []);
  const [scheduleConfig, setScheduleConfig] = useState(
    JSON.stringify(agent.scheduleConfig || {}, null, 2)
  );

  // Common advanced fields
  const [authEndpoint, setAuthEndpoint] = useState(agent.authEndpoint || "");
  const [healthEndpoint, setHealthEndpoint] = useState(agent.healthEndpoint || "");
  const [webhookSecret, setWebhookSecret] = useState(agent.webhookSecret || "");
  const [credentialSchema, setCredentialSchema] = useState(
    JSON.stringify(agent.credentialSchema || {}, null, 2)
  );
  const [tokenResponseKey, setTokenResponseKey] = useState(
    agent.tokenResponseKey || "access_token"
  );
  const [tokenQueryParamName, setTokenQueryParamName] = useState(
    agent.tokenQueryParamName || "token"
  );

  const [iconRemoved, setIconRemoved] = useState(false);
  const [coverRemoved, setCoverRemoved] = useState(false);

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

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

    let parsedCredentialSchema: Record<string, unknown> | undefined;
    let parsedInputSchema: Record<string, unknown> | undefined;
    let parsedScheduleConfig: Record<string, unknown> | undefined;
    let parsedChatApiRequestFormat: Record<string, unknown> | undefined;
    let parsedChatApiResponseFormat: Record<string, unknown> | undefined;

    try {
      parsedCredentialSchema = credentialSchema ? JSON.parse(credentialSchema) : undefined;
      parsedInputSchema = inputSchema ? JSON.parse(inputSchema) : undefined;
      parsedScheduleConfig = scheduleConfig ? JSON.parse(scheduleConfig) : undefined;
      parsedChatApiRequestFormat = chatApiRequestFormat
        ? JSON.parse(chatApiRequestFormat)
        : undefined;
      parsedChatApiResponseFormat = chatApiResponseFormat
        ? JSON.parse(chatApiResponseFormat)
        : undefined;
    } catch (_error) {
      // eslint-disable-next-line no-alert
      alert("Invalid JSON in one of the schema fields");
      return;
    }

    const data: ExternalAgentGeneralFormValues = {
      name,
      description,
      shortDescription,
      longDescription,
      welcomeMessage,
      demoUrl,
      tags,
      siteUrl,
      authMethod: authMethod as "api_key" | "jwt" | "oauth2" | "basic",
      executionMode: executionMode as "redirect" | "proxied" | "api_call",
      interactionMode: interactionMode as "chat" | "auto_reply" | "task" | "event" | "hybrid",
      documentationUrl,
      rateLimitPerMinute: parseInt(rateLimitPerMinute, 10),
      timeoutSeconds: parseInt(timeoutSeconds, 10),

      // Chat mode
      chatFrontendUrl,
      chatApiEndpoint,
      supportsStreaming,
      chatApiRequestFormat: parsedChatApiRequestFormat,
      chatApiResponseFormat: parsedChatApiResponseFormat,

      // Task mode
      executeEndpoint,
      outputFormat: outputFormat as "text" | "json" | "file" | "html" | "markdown",
      isAsyncExecution,
      callbackUrl,
      inputSchema: parsedInputSchema,

      // Auto-reply mode
      replyEndpoint,
      supportedPlatforms,

      // Event mode
      eventEndpoint,
      triggerType: triggerType as TriggerType | undefined,
      supportedEvents,
      scheduleConfig: parsedScheduleConfig,

      // Common advanced
      authEndpoint,
      healthEndpoint,
      webhookSecret,
      credentialSchema: parsedCredentialSchema,
      tokenResponseKey,
      tokenQueryParamName,

      // File uploads
      iconFile,
      coverFile,
      iconRemoved,
      coverRemoved,
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
          {t("pages.external_agent_settings.general.title", "General Settings")}
        </h2>
        <p className="text-muted-foreground text-[0.9375rem]">
          {t(
            "pages.external_agent_settings.general.description",
            "Configure your external agent's basic information and connection settings."
          )}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {t("pages.external_agent_settings.general.cover_image", "Cover Image")}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {t(
              "pages.external_agent_settings.general.cover_description",
              "Upload a cover image for your external agent"
            )}
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
                    {t("pages.external_agent_settings.general.change", "Change")}
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
                    {t("pages.external_agent_settings.general.remove", "Remove")}
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
                  {t("pages.external_agent_settings.general.upload_cover", "Upload Cover")}
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

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {t("pages.external_agent_settings.general.agent_icon", "Agent Icon")}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {t(
              "pages.external_agent_settings.general.icon_description",
              "Upload an icon for your external agent"
            )}
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
                  {t("pages.external_agent_settings.general.upload_icon", "Upload Icon")}
                </Button>
                {(iconFile || agent.iconUrl) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5 border-destructive text-destructive hover:bg-destructive hover:text-white"
                    onClick={() => {
                      setIconFile(null);
                      setIconRemoved(true);
                    }}
                  >
                    <X size={14} />
                    {t("pages.external_agent_settings.general.remove", "Remove")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {t("pages.external_agent_settings.general.basic_config", "Basic Configuration")}
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            {t(
              "pages.external_agent_settings.general.basic_config_description",
              "Configure the basic connection and authentication settings"
            )}
          </p>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="agent-name" className="mb-1.5 block">
                {t("pages.external_agent_settings.general.name", "Agent Name")}
              </Label>
              <Input
                id="agent-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My External Agent"
                required
              />
            </div>

            <div>
              <Label htmlFor="agent-category" className="mb-1.5 block">
                {t("pages.external_agent_settings.general.category", "Category")}
              </Label>
              <Select value={category} onValueChange={setCategory} disabled={isLoadingCategories}>
                <SelectTrigger id="agent-category">
                  <SelectValue
                    placeholder={
                      isLoadingCategories
                        ? t(
                            "pages.external_agent_settings.general.loading_categories",
                            "Loading categories..."
                          )
                        : t(
                            "pages.external_agent_settings.general.select_category",
                            "Select a category"
                          )
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

            <div>
              <Label htmlFor="tags" className="mb-1.5 block">
                {t("pages.external_agent_settings.general.tags", "Tags")}
              </Label>
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press Enter"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                {t(
                  "pages.external_agent_settings.general.tags_description",
                  "Add tags to help users discover your agent"
                )}
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
                {t("pages.external_agent_settings.general.demo_url", "Demo URL")}
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
                {t("pages.external_agent_settings.general.short_description", "Short Description")}
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
                {t("pages.external_agent_settings.general.description", "Description")}
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
                {t("pages.external_agent_settings.general.long_description", "Long Description")}
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
                {t("pages.external_agent_settings.general.welcome_message", "Welcome Message")}
              </Label>
              <Textarea
                id="welcome-msg"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                placeholder="Hello! How can I help you today?"
                rows={2}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="site-url" className="mb-1.5 block">
                {t("pages.external_agent_settings.general.site_url", "Site URL")} *
              </Label>
              <Input
                id="site-url"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="auth-method" className="mb-1.5 block">
                {t("pages.external_agent_settings.general.auth_method", "Authentication Method")}
              </Label>
              <Select
                value={authMethod}
                onValueChange={(v) => setAuthMethod(v as "api_key" | "jwt" | "oauth2" | "basic")}
              >
                <SelectTrigger id="auth-method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="api_key">API Key</SelectItem>
                  <SelectItem value="jwt">JWT</SelectItem>
                  <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                  <SelectItem value="basic">Basic Auth</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="execution-mode" className="mb-1.5 block">
                {t("pages.external_agent_settings.general.execution_mode", "Execution Mode")}
              </Label>
              <Select
                value={executionMode}
                onValueChange={(v) => setExecutionMode(v as "redirect" | "proxied" | "api_call")}
              >
                <SelectTrigger id="execution-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="redirect">Redirect</SelectItem>
                  <SelectItem value="proxied">Proxied</SelectItem>
                  <SelectItem value="api_call">API Call</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="interaction-mode" className="mb-1.5 block">
                {t("pages.external_agent_settings.general.interaction_mode", "Interaction Mode")}
              </Label>
              <Select
                value={interactionMode}
                onValueChange={(v) =>
                  setInteractionMode(v as "chat" | "auto_reply" | "task" | "event" | "hybrid")
                }
              >
                <SelectTrigger id="interaction-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chat">Chat</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="auto_reply">Auto Reply</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="rate-limit" className="mb-1.5 block">
                {t("pages.external_agent_settings.general.rate_limit", "Rate Limit (per minute)")}
              </Label>
              <Input
                id="rate-limit"
                type="number"
                value={rateLimitPerMinute}
                onChange={(e) => setRateLimitPerMinute(e.target.value)}
                placeholder="60"
              />
            </div>

            <div>
              <Label htmlFor="timeout" className="mb-1.5 block">
                {t("pages.external_agent_settings.general.timeout", "Timeout (seconds)")}
              </Label>
              <Input
                id="timeout"
                type="number"
                value={timeoutSeconds}
                onChange={(e) => setTimeoutSeconds(e.target.value)}
                placeholder="30"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="documentation-url" className="mb-1.5 block">
                {t("pages.external_agent_settings.general.documentation_url", "Documentation URL")}
              </Label>
              <Input
                id="documentation-url"
                value={documentationUrl}
                onChange={(e) => setDocumentationUrl(e.target.value)}
                placeholder="https://docs.example.com"
              />
            </div>
          </div>
        </div>

        {(interactionMode === "chat" || interactionMode === "hybrid") && (
          <ChatConfigSection
            executionMode={executionMode}
            chatFrontendUrl={chatFrontendUrl}
            setChatFrontendUrl={setChatFrontendUrl}
            chatApiEndpoint={chatApiEndpoint}
            setChatApiEndpoint={setChatApiEndpoint}
            supportsStreaming={supportsStreaming}
            setSupportsStreaming={setSupportsStreaming}
            chatApiRequestFormat={chatApiRequestFormat}
            setChatApiRequestFormat={setChatApiRequestFormat}
            chatApiResponseFormat={chatApiResponseFormat}
            setChatApiResponseFormat={setChatApiResponseFormat}
          />
        )}

        {(interactionMode === "task" || interactionMode === "hybrid") && (
          <TaskConfigSection
            executeEndpoint={executeEndpoint}
            setExecuteEndpoint={setExecuteEndpoint}
            outputFormat={outputFormat}
            setOutputFormat={setOutputFormat}
            isAsyncExecution={isAsyncExecution}
            setIsAsyncExecution={setIsAsyncExecution}
            callbackUrl={callbackUrl}
            setCallbackUrl={setCallbackUrl}
            inputSchema={inputSchema}
            setInputSchema={setInputSchema}
          />
        )}

        {(interactionMode === "auto_reply" || interactionMode === "hybrid") && (
          <AutoReplyConfigSection
            replyEndpoint={replyEndpoint}
            setReplyEndpoint={setReplyEndpoint}
            supportedPlatforms={supportedPlatforms}
            setSupportedPlatforms={setSupportedPlatforms}
          />
        )}

        {(interactionMode === "event" || interactionMode === "hybrid") && (
          <EventConfigSection
            eventEndpoint={eventEndpoint}
            setEventEndpoint={setEventEndpoint}
            triggerType={triggerType}
            setTriggerType={setTriggerType}
            supportedEvents={supportedEvents}
            setSupportedEvents={setSupportedEvents}
            scheduleConfig={scheduleConfig}
            setScheduleConfig={setScheduleConfig}
          />
        )}

        <AdvancedSettingsSection
          authEndpoint={authEndpoint}
          setAuthEndpoint={setAuthEndpoint}
          healthEndpoint={healthEndpoint}
          setHealthEndpoint={setHealthEndpoint}
          tokenResponseKey={tokenResponseKey}
          setTokenResponseKey={setTokenResponseKey}
          tokenQueryParamName={tokenQueryParamName}
          setTokenQueryParamName={setTokenQueryParamName}
          webhookSecret={webhookSecret}
          setWebhookSecret={setWebhookSecret}
          credentialSchema={credentialSchema}
          setCredentialSchema={setCredentialSchema}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="submit" disabled={isPending} className="gap-1.5">
            {isPending && <Loader2 size={14} className="animate-spin" />}
            {t("pages.external_agent_settings.general.save_changes", "Save Changes")}
          </Button>
        </div>
      </form>

      <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h3 className="text-base font-semibold text-foreground mb-0.5">
              {t("pages.external_agent_settings.general.delete_title", "Delete this agent")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t(
                "pages.external_agent_settings.general.delete_description",
                "Permanently remove this external agent. This cannot be undone."
              )}
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
                  {t("pages.external_agent_settings.general.cancel", "Cancel")}
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
                  {t("pages.external_agent_settings.general.yes_delete", "Yes, delete")}
                </Button>
              </>
            ) : (
              <Button
                variant="destructive"
                size="sm"
                className="gap-1.5"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 size={14} />{" "}
                {t("pages.external_agent_settings.general.delete_agent", "Delete Agent")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
