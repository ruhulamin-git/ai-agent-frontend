"use client";

import { ArrowLeft, Camera, ImageIcon, Save, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";

import { Badge } from "@/shared/ui/badge";
import { Breadcrumb } from "@/shared/ui/breadcrumb";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";

import { useGetAgentDetail } from "../agent-settings/service";
import { useGetCategories, useUpdateAgent } from "./service";

interface AgentEditProps {
  agentId: string;
}

export const AgentEdit = ({ agentId }: AgentEditProps) => {
  const router = useRouter();
  const iconInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Load categories from backend
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategories();

  // Update agent mutation
  const { mutate: updateAgent, isPending: isSaving } = useUpdateAgent();

  const breadcrumbItems = [
    { label: "Agent Library", href: "/developer-dashboard/agents" },
    { label: "Edit Agent", isActive: true },
  ];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    welcomeMessage: "",
    shortDescription: "",
    longDescription: "",
    demoUrl: "",
    category: "",
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [iconRemoved, setIconRemoved] = useState(false);
  const [coverRemoved, setCoverRemoved] = useState(false);

  const { data: agent, isLoading: agentLoading } = useGetAgentDetail(agentId);

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name || "",
        description: agent.description || "",
        welcomeMessage: agent.welcomeMessage || "",
        shortDescription: agent.shortDescription || "",
        longDescription: agent.longDescription || "",
        demoUrl: agent.demoUrl || "",
        category: (agent as any).category?.id?.toString() || (typeof (agent as any).category === 'number' || typeof (agent as any).category === 'string' ? (agent as any).category.toString() : "") || (agent as any).categoryId?.toString() || (agent as any).category_id?.toString() || "",
      });
      setTags(agent.tags || []);
      if (agent.iconUrl) setIconPreview(agent.iconUrl);
      if (agent.coverImageUrl) setCoverPreview(agent.coverImageUrl);
    }
  }, [agent]);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      setIconRemoved(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverRemoved(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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

  const handleSave = async () => {
    const data: any = {
      name: formData.name,
      description: formData.description,
      welcomeMessage: formData.welcomeMessage,
      shortDescription: formData.shortDescription,
      longDescription: formData.longDescription,
      demoUrl: formData.demoUrl,
      tags: tags,
      iconRemoved,
      coverRemoved,
    };

    // Add category as number if selected
    if (formData.category) {
      data.category = parseInt(formData.category, 10);
    }

    // Add files if they exist
    if (iconFile) {
      data.icon = iconFile;
    }
    if (coverFile) {
      data.coverImage = coverFile;
    }

    updateAgent(
      { agentId, data },
      {
        onSuccess: () => {
          toast.success("Agent updated successfully");
        },
        onError: (error) => {
          console.error("Failed to update agent:", error);
          toast.error("Failed to update agent. Please try again.");
        },
      }
    );
  };

  if (agentLoading) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-6 overflow-y-auto scrollbar-thin">
      <Toaster richColors position="top-right" />
      {/* Header */}
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Edit Additional Information</h1>
            <p className="text-gray-600 dark:text-gray-400">Update your agent content and configuration</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 cursor-pointer rounded text-sm font-medium transition-colors border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2 inline" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 cursor-pointer rounded text-sm font-medium transition-colors text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800/90 hover:bg-gray-300 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2 inline" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Media Section */}
        <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white text-lg">Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cover Image */}
            <div>
              <Label className="text-gray-700 dark:text-gray-300 mb-2 block">Cover Image</Label>
              <div className="relative w-full h-48 rounded-lg border-2 border-dashed border-gray-400 dark:border-gray-700 overflow-hidden group bg-gray-200 dark:bg-gray-800/30 hover:border-purple-500/50 transition-colors">
                {coverPreview ? (
                  <>
                    <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => coverInputRef.current?.click()}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Change
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setCoverPreview(null);
                          setCoverFile(null);
                          setCoverRemoved(true);
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer"
                    onClick={() => coverInputRef.current?.click()}
                  >
                    <ImageIcon className="w-8 h-8 text-gray-500" />
                    <span className="text-sm text-gray-400">Upload Cover Image</span>
                    <span className="text-xs text-gray-500">Recommended: 1200x630px</span>
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

            {/* Agent Icon */}
            <div>
              <Label className="text-gray-700 dark:text-gray-300 mb-2 block">Agent Icon</Label>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 rounded-lg border-2 border-dashed border-gray-400 dark:border-gray-700 overflow-hidden group bg-gray-200 dark:bg-gray-800/30 hover:border-purple-500/50 transition-colors shrink-0">
                  {iconPreview ? (
                    <>
                      <img src={iconPreview} alt="Icon" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera
                          className="w-5 h-5 text-white cursor-pointer"
                          onClick={() => iconInputRef.current?.click()}
                        />
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="w-full h-full flex items-center justify-center cursor-pointer"
                      onClick={() => iconInputRef.current?.click()}
                    >
                      <Upload className="w-6 h-6 text-gray-500" />
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
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300"
                    onClick={() => iconInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Icon
                  </Button>
                  {iconPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      onClick={() => {
                        setIconPreview(null);
                        setIconFile(null);
                        setIconRemoved(true);
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-500">Recommended: 256x256px</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">Agent Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-200 dark:bg-gray-800/50 border-gray-400 dark:border-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter agent name"
                />
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">Short Description *</Label>
                <Input
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="bg-gray-200 dark:bg-gray-800/50 border-gray-400 dark:border-gray-700 text-gray-900 dark:text-white"
                  placeholder="Brief description (max 100 characters)"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {formData.shortDescription.length}/100 characters
                </p>
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="bg-gray-200 dark:bg-gray-800/50 border-gray-400 dark:border-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Detailed description of your agent"
                />
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">Welcome Message</Label>
                <Textarea
                  value={formData.welcomeMessage}
                  onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                  rows={4}
                  className="bg-gray-200 dark:bg-gray-800/50 border-gray-400 dark:border-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Message shown when users start a conversation"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white text-lg">Additional Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">Category</Label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-800/50 border border-gray-400 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
                  disabled={categoriesLoading}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                    backgroundSize: "1.25rem",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="" className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {categoriesLoading ? "Loading categories..." : "Select a category"}
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">Demo URL</Label>
                <Input
                  type="url"
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  className="bg-gray-200 dark:bg-gray-800/50 border-gray-400 dark:border-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://example.com/demo"
                />
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">Tags</Label>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="bg-gray-200 dark:bg-gray-800/50 border-gray-400 dark:border-gray-700 text-gray-900 dark:text-white"
                  placeholder="Type a tag and press Enter"
                />
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Press Enter to add tags</p>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-purple-600/20 text-purple-300 border border-purple-500/30 pl-3 pr-2 py-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1.5 hover:bg-purple-500/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">Long Description</Label>
                <Textarea
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  rows={6}
                  className="bg-gray-200 dark:bg-gray-800/50 border-gray-400 dark:border-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Comprehensive description with features and capabilities"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
