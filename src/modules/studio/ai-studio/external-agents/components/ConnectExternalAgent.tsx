import { useFormik } from "formik";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";

import { CustomTextArea, CustomTextField } from "@/shared/form-elements";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

import { AutoReplyModeConfig } from "./AutoReplyModeConfig";
import { ChatModeConfig } from "./ChatModeConfig";
import { CredentialSchemaBuilder } from "./CredentialSchemaBuilder";
import { EventModeConfig } from "./EventModeConfig";
import { TaskModeConfig } from "./TaskModeConfig";

import type { AuthMethod, CreateExternalAgentDTO, ExecutionMode, InteractionMode } from "../types";

// Interfaces
interface CredentialField {
  id: string;
  name: string;
  label: string;
  type:
    | "text"
    | "password"
    | "email"
    | "number"
    | "url"
    | "textarea"
    | "date"
    | "checkbox"
    | "select";
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: string[];
}

interface InputSchemaField {
  id: string;
  name: string;
  label: string;
  type: "string" | "number" | "integer" | "boolean" | "array" | "object";
  required: boolean;
  description?: string;
  minimum?: number;
  maximum?: number;
  items?: { type: string };
}

interface PlatformConfig {
  id: string;
  platform: "telegram" | "whatsapp" | "messenger" | "instagram";
  enabled: boolean;
  config?: Record<string, any>;
}

interface EventConfig {
  id: string;
  eventType: string;
  enabled: boolean;
  description?: string;
}

interface ScheduleConfig {
  cron: string;
  timezone: string;
  description?: string;
}

interface ConnectExternalAgentProps {
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmit: (data: CreateExternalAgentDTO) => void;
  isSubmitting: boolean;
  onCancel?: () => void;
}
// Constants
const interactionModes: Array<{
  value: InteractionMode;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    value: "chat",
    label: "Chat",
    icon: "💬",
    description: "Real-time conversational interface for customer support, FAQ bots",
  },
  {
    value: "auto_reply",
    label: "Auto Reply",
    icon: "⚡",
    description: "Listens on platform and auto-responds to messages on Telegram/WhatsApp",
  },
  {
    value: "task",
    label: "Task",
    icon: "📋",
    description: "Input → Processing → Output (one-shot) like SEO writer, image generator",
  },
  {
    value: "event",
    label: "Event",
    icon: "🔔",
    description: "Triggered by schedule or webhooks for social media posting, cron jobs",
  },
  {
    value: "hybrid",
    label: "Hybrid",
    icon: "🔄",
    description: "Combination of multiple modes for complex e-commerce bots",
  },
];

const executionModes: Array<{ value: ExecutionMode; label: string }> = [
  { value: "redirect", label: "Redirect to External UI" },
  { value: "proxied", label: "Proxy Through Platform" },
  { value: "api_call", label: "Direct API Call" },
];

const authMethods: Array<{ value: AuthMethod; label: string }> = [
  { value: "api_key", label: "API Key" },
  { value: "jwt", label: "JWT Token" },
  { value: "oauth2", label: "OAuth 2.0" },
  { value: "basic", label: "Basic Authentication" },
];

// Validation schemas
const step1Schema = yup.object({
  name: yup.string().required("Agent name is required"),
  description: yup.string().required("Description is required"),
  interactionMode: yup.string().required("Interaction mode is required"),
});

const step2Schema = yup.object({
  siteUrl: yup.string().url("Must be a valid URL").required("Site URL is required"),
  authMethod: yup.string().required("Authentication method is required"),
  executionMode: yup.string().required("Execution mode is required"),
});

const step3Schema = yup.object().shape({
  // Chat mode requirements
  chatFrontendUrl: yup.string().when(["interactionMode", "executionMode"], {
    is: (interactionMode: InteractionMode, executionMode: ExecutionMode) =>
      (interactionMode === "chat" || interactionMode === "hybrid") && executionMode === "redirect",
    then: (schema) =>
      schema.url("Must be a valid URL").required("Chat Frontend URL is required for redirect mode"),
    otherwise: (schema) => schema.nullable(),
  }),
  chatApiEndpoint: yup.string().when(["interactionMode", "executionMode"], {
    is: (interactionMode: InteractionMode, executionMode: ExecutionMode) =>
      (interactionMode === "chat" || interactionMode === "hybrid") && executionMode === "proxied",
    then: (schema) => schema.required("Chat API Endpoint is required for proxied mode"),
    otherwise: (schema) => schema.nullable(),
  }),

  // Task mode requirements
  executeEndpoint: yup.string().when("interactionMode", {
    is: (interactionMode: InteractionMode) =>
      interactionMode === "task" || interactionMode === "hybrid",
    then: (schema) => schema.required("Execute Endpoint is required for task mode"),
    otherwise: (schema) => schema.nullable(),
  }),

  // Auto-reply mode requirements
  replyEndpoint: yup.string().when("interactionMode", {
    is: (interactionMode: InteractionMode) =>
      interactionMode === "auto_reply" || interactionMode === "hybrid",
    then: (schema) => schema.required("Reply Endpoint is required for auto-reply mode"),
    otherwise: (schema) => schema.nullable(),
  }),

  // Event mode requirements
  eventEndpoint: yup.string().when("interactionMode", {
    is: (interactionMode: InteractionMode) =>
      interactionMode === "event" || interactionMode === "hybrid",
    then: (schema) => schema.required("Event Endpoint is required for event mode"),
    otherwise: (schema) => schema.nullable(),
  }),
});
export const ConnectExternalAgent = ({
  currentStep,
  onNextStep,
  onPrevStep,
  onSubmit,
  isSubmitting,
  onCancel,
}: ConnectExternalAgentProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  // State for custom builders
  const [credentialFields, setCredentialFields] = useState<CredentialField[]>([]);
  const [inputSchemaFields, setInputSchemaFields] = useState<InputSchemaField[]>([]);
  const [platformConfigs, setPlatformConfigs] = useState<PlatformConfig[]>([]);
  const [eventConfigs, setEventConfigs] = useState<EventConfig[]>([]);
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig>({
    cron: "0 9 * * *",
    timezone: "UTC",
    description: "Daily at 9 AM UTC",
  });

  // Helper functions
  const initializePlatformConfigs = () => {
    const platforms: Array<"telegram" | "whatsapp" | "messenger" | "instagram"> = [
      "telegram",
      "whatsapp",
      "messenger",
      "instagram",
    ];

    const configs: PlatformConfig[] = platforms.map((platform) => ({
      id: `platform_${platform}`,
      platform,
      enabled: false,
      config: {},
    }));

    setPlatformConfigs(configs);
  };

  const initializeEventConfigs = () => {
    const eventTypes = [
      { type: "post_created", description: "When a new post is created" },
      { type: "post_scheduled", description: "When a post is scheduled" },
      { type: "user_registered", description: "When a new user registers" },
      { type: "payment_completed", description: "When a payment is completed" },
      { type: "custom_event", description: "Custom webhook event" },
    ];

    const configs: EventConfig[] = eventTypes.map((event) => ({
      id: `event_${event.type}`,
      eventType: event.type,
      enabled: false,
      description: event.description,
    }));

    setEventConfigs(configs);
  };

  const getEnabledPlatforms = () => {
    return platformConfigs.filter((config) => config.enabled).map((config) => config.platform);
  };

  const getEnabledEvents = () => {
    return eventConfigs.filter((config) => config.enabled).map((config) => config.eventType);
  };

  // Convert credential fields to schema format
  const credentialFieldsToSchema = () => {
    const filledFields = credentialFields.filter(
      (field) => field.name.trim() && field.label.trim()
    );

    if (filledFields.length === 0) return null;

    return {
      fields: filledFields.map((field) => ({
        name: field.name.trim(),
        label: field.label.trim(),
        type: field.type,
        required: field.required,
        placeholder: field.placeholder?.trim() || undefined,
        help_text: field.helpText?.trim() || undefined,
        options: field.type === "select" ? field.options : undefined,
      })),
    };
  };

  // Convert input schema fields to JSON schema format
  const inputSchemaFieldsToSchema = () => {
    const filledFields = inputSchemaFields.filter(
      (field) => field.name.trim() && field.label.trim()
    );

    if (filledFields.length === 0) return {};

    const properties: Record<string, any> = {};
    const required: string[] = [];

    filledFields.forEach((field) => {
      const property: any = {
        type: field.type,
        description: field.description || field.label,
      };

      if (field.type === "number" || field.type === "integer") {
        if (field.minimum !== undefined) property.minimum = field.minimum;
        if (field.maximum !== undefined) property.maximum = field.maximum;
      }

      if (field.type === "array" && field.items) {
        property.items = field.items;
      }

      properties[field.name.trim()] = property;

      if (field.required) {
        required.push(field.name.trim());
      }
    });

    return {
      type: "object",
      properties,
      ...(required.length > 0 && { required }),
    };
  };
  // Formik setup
  const formik = useFormik<CreateExternalAgentDTO>({
    initialValues: {
      // Agent metadata
      name: "",
      description: "",
      interactionMode: "chat",

      // ExternalAgent configuration
      siteUrl: "",
      authMethod: "api_key",
      authEndpoint: "",
      executionMode: "redirect",

      // Chat mode fields
      chatFrontendUrl: "",
      chatApiEndpoint: "",
      supportsStreaming: false,

      // Task mode fields
      executeEndpoint: "",
      inputSchema: {},
      outputFormat: "json",
      isAsyncExecution: false,
      callbackUrl: "",

      // Auto-reply mode fields
      replyEndpoint: "",
      supportedPlatforms: [],

      // Event mode fields
      eventEndpoint: "",
      triggerType: "schedule",
      scheduleConfig: {},
      supportedEvents: [],

      // Common optional fields
      healthEndpoint: "",
      documentationUrl: "",
      rateLimitPerMinute: 60,
      timeoutSeconds: 30,
    },
    validationSchema:
      currentStep === 1 ? step1Schema : currentStep === 2 ? step2Schema : step3Schema,
    onSubmit: (values) => {
      if (currentStep < 3) {
        onNextStep();
      } else {
        const { interactionMode } = values;

        // Validate platform configs for auto-reply mode
        if (interactionMode === "auto_reply" || interactionMode === "hybrid") {
          const enabledPlatforms = getEnabledPlatforms();
          if (enabledPlatforms.length === 0) {
            console.error("❌ Auto-reply mode requires at least one platform to be selected");
            return;
          }
        }

        // Validate event configs for event mode
        if (interactionMode === "event" || interactionMode === "hybrid") {
          const enabledEvents = getEnabledEvents();
          if (enabledEvents.length === 0) {
            console.error("❌ Event mode requires at least one event type to be selected");
            return;
          }
        }

        // Add credential schema from fields
        const credentialSchema = credentialFieldsToSchema();

        // Clean up the values before submitting - only include relevant fields
        const baseValues = {
          name: values.name,
          description: values.description,
          interactionMode: values.interactionMode,
          siteUrl: values.siteUrl,
          authMethod: values.authMethod,
          executionMode: values.executionMode,
        };

        // Add optional common fields
        const optionalFields: Record<string, any> = {};
        if (values.authEndpoint?.trim()) optionalFields.authEndpoint = values.authEndpoint;
        if (values.healthEndpoint?.trim()) optionalFields.healthEndpoint = values.healthEndpoint;
        if (values.documentationUrl?.trim())
          optionalFields.documentationUrl = values.documentationUrl;
        if (values.rateLimitPerMinute && values.rateLimitPerMinute !== 60)
          optionalFields.rateLimitPerMinute = values.rateLimitPerMinute;
        if (values.timeoutSeconds && values.timeoutSeconds !== 30)
          optionalFields.timeoutSeconds = values.timeoutSeconds;
        if (credentialSchema) optionalFields.credentialSchema = credentialSchema;

        // Add mode-specific fields
        const { executionMode } = values;

        // Chat mode fields
        if (interactionMode === "chat" || interactionMode === "hybrid") {
          if (executionMode === "redirect" && values.chatFrontendUrl?.trim()) {
            optionalFields.chatFrontendUrl = values.chatFrontendUrl;
          }
          if (executionMode === "proxied") {
            if (values.chatApiEndpoint?.trim())
              optionalFields.chatApiEndpoint = values.chatApiEndpoint;
            if (values.supportsStreaming)
              optionalFields.supportsStreaming = values.supportsStreaming;
          }
        }

        // Task mode fields
        if (interactionMode === "task" || interactionMode === "hybrid") {
          if (values.executeEndpoint?.trim())
            optionalFields.executeEndpoint = values.executeEndpoint;

          // Use custom input schema if available
          const customInputSchema = inputSchemaFieldsToSchema();
          if (Object.keys(customInputSchema).length > 0) {
            optionalFields.inputSchema = customInputSchema;
          }

          if (values.outputFormat && values.outputFormat !== "json")
            optionalFields.outputFormat = values.outputFormat;
          if (values.isAsyncExecution) {
            optionalFields.isAsyncExecution = values.isAsyncExecution;
            if (values.callbackUrl?.trim()) optionalFields.callbackUrl = values.callbackUrl;
          }
        }

        // Auto-reply mode fields
        if (interactionMode === "auto_reply" || interactionMode === "hybrid") {
          if (values.replyEndpoint?.trim()) optionalFields.replyEndpoint = values.replyEndpoint;

          // Use custom platform configs
          const enabledPlatforms = getEnabledPlatforms();
          if (enabledPlatforms.length > 0) {
            optionalFields.supportedPlatforms = enabledPlatforms;
            console.log("📱 Using platform configs:", enabledPlatforms);
          }
        }

        // Event mode fields
        if (interactionMode === "event" || interactionMode === "hybrid") {
          if (values.eventEndpoint?.trim()) optionalFields.eventEndpoint = values.eventEndpoint;
          if (values.triggerType && values.triggerType !== "schedule")
            optionalFields.triggerType = values.triggerType;

          // Use custom schedule config
          if (values.triggerType === "schedule" && scheduleConfig.cron) {
            optionalFields.scheduleConfig = {
              cron: scheduleConfig.cron,
              timezone: scheduleConfig.timezone,
              ...(scheduleConfig.description && { description: scheduleConfig.description }),
            };
            console.log("⏰ Using schedule config:", optionalFields.scheduleConfig);
          }

          // Use custom event configs
          const enabledEvents = getEnabledEvents();
          if (enabledEvents.length > 0) {
            optionalFields.supportedEvents = enabledEvents;
            console.log("🎯 Using event configs:", enabledEvents);
          }
        }

        const finalPayload = { ...baseValues, ...optionalFields };
        console.log("🚀 Final payload:", finalPayload);

        onSubmit(finalPayload as CreateExternalAgentDTO);
      }
    },
  });
  // Initialize configs based on interaction mode
  useEffect(() => {
    const interactionMode = formik.values.interactionMode;

    // Initialize platform configs for auto-reply mode
    if (
      (interactionMode === "auto_reply" || interactionMode === "hybrid") &&
      platformConfigs.length === 0
    ) {
      initializePlatformConfigs();
    }

    // Initialize event configs for event mode
    if (
      (interactionMode === "event" || interactionMode === "hybrid") &&
      eventConfigs.length === 0
    ) {
      initializeEventConfigs();
    }

    // Clear configs when not needed
    if (interactionMode !== "auto_reply" && interactionMode !== "hybrid") {
      setPlatformConfigs([]);
    }
    if (interactionMode !== "event" && interactionMode !== "hybrid") {
      setEventConfigs([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.interactionMode]);

  // Add default input schema fields for task mode
  useEffect(() => {
    const interactionMode = formik.values.interactionMode;

    // Add default input schema fields for task mode if none exist
    if (
      (interactionMode === "task" || interactionMode === "hybrid") &&
      inputSchemaFields.length === 0
    ) {
      const defaultFields: InputSchemaField[] = [
        {
          id: `input_field_${Date.now()}`,
          name: "topic",
          label: "Topic",
          type: "string",
          required: true,
          description: "Main topic or subject for the task",
        },
        {
          id: `input_field_${Date.now() + 1}`,
          name: "instructions",
          label: "Instructions",
          type: "string",
          required: false,
          description: "Additional instructions or requirements",
        },
      ];
      setInputSchemaFields(defaultFields);
    }

    // Clear input schema fields when not in task mode
    if (interactionMode !== "task" && interactionMode !== "hybrid") {
      setInputSchemaFields([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.interactionMode]);

  // Add default credential fields based on auth method
  useEffect(() => {
    const authMethod = formik.values.authMethod;

    // Only add one example field if no custom fields exist
    if (credentialFields.length === 0) {
      let exampleField: CredentialField;

      switch (authMethod) {
        case "api_key":
          exampleField = {
            id: `field_${Date.now()}`,
            name: "api_key",
            label: "API Key",
            type: "password",
            required: true,
            placeholder: "Enter your API key",
            helpText: "You can find this in your account settings",
          };
          break;
        case "jwt":
          exampleField = {
            id: `field_${Date.now()}`,
            name: "jwt_token",
            label: "JWT Token",
            type: "password",
            required: true,
            placeholder: "Enter your JWT token",
            helpText: "JWT token for authentication",
          };
          break;
        case "basic":
          exampleField = {
            id: `field_${Date.now()}`,
            name: "username",
            label: "Username",
            type: "text",
            required: true,
            placeholder: "Enter username",
            helpText: "Your account username",
          };
          break;
        case "oauth2":
          exampleField = {
            id: `field_${Date.now()}`,
            name: "client_id",
            label: "Client ID",
            type: "text",
            required: true,
            placeholder: "Enter client ID",
            helpText: "OAuth2 client identifier",
          };
          break;
        default:
          exampleField = {
            id: `field_${Date.now()}`,
            name: "",
            label: "",
            type: "text",
            required: false,
            placeholder: "",
            helpText: "",
          };
      }

      setCredentialFields([exampleField]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.authMethod]);

  // Clear irrelevant fields when interaction mode changes
  useEffect(() => {
    const interactionMode = formik.values.interactionMode;

    // Clear fields that are not relevant to the current interaction mode
    if (interactionMode !== "chat" && interactionMode !== "hybrid") {
      formik.setFieldValue("chatFrontendUrl", "");
      formik.setFieldValue("chatApiEndpoint", "");
      formik.setFieldValue("supportsStreaming", false);
    }

    if (interactionMode !== "task" && interactionMode !== "hybrid") {
      formik.setFieldValue("executeEndpoint", "");
      formik.setFieldValue("inputSchema", null);
      formik.setFieldValue("outputFormat", "json");
      formik.setFieldValue("isAsyncExecution", false);
      formik.setFieldValue("callbackUrl", "");
    }

    if (interactionMode !== "auto_reply" && interactionMode !== "hybrid") {
      formik.setFieldValue("replyEndpoint", "");
      formik.setFieldValue("supportedPlatforms", []);
    }

    if (interactionMode !== "event" && interactionMode !== "hybrid") {
      formik.setFieldValue("eventEndpoint", "");
      formik.setFieldValue("triggerType", "schedule");
      formik.setFieldValue("scheduleConfig", null);
      formik.setFieldValue("supportedEvents", []);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.interactionMode]);

  const needsCredentials = ["api_key", "jwt", "oauth2", "basic"].includes(formik.values.authMethod);

  const isChatMode =
    formik.values.interactionMode === "chat" || formik.values.interactionMode === "hybrid";
  const isTaskMode =
    formik.values.interactionMode === "task" || formik.values.interactionMode === "hybrid";
  const isAutoReplyMode =
    formik.values.interactionMode === "auto_reply" || formik.values.interactionMode === "hybrid";
  const isEventMode =
    formik.values.interactionMode === "event" || formik.values.interactionMode === "hybrid";
  return (
    <div className="mx-auto p-6">
      {/* Back Button */}
      <button
        className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-muted-foreground bg-transparent border-none cursor-pointer p-0 mb-6 transition-colors hover:text-primary"
        onClick={() => router.push("/dashboard/ai-studio/external-agents")}
      >
        <ArrowLeft size={16} />
        {t("pages.external_agent_settings.back_to_studio", "Back to External Agents")}
      </button>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">
          {t("pages.external_agents.modal.title", "Connect External AI Agent")}
        </h1>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`flex-1 h-2 rounded-full transition-all ${
                step <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Step 1: Basic Details & Interaction Mode */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Agent Name <span className="text-red-500">*</span>
              </Label>
              <CustomTextField
                id="name"
                name="name"
                placeholder="e.g., OpenAI GPT-4 Agent"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name ? (formik.errors.name as string) : undefined}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </Label>
              <CustomTextArea
                id="description"
                name="description"
                placeholder="Describe what this agent does and its capabilities..."
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={
                  formik.touched.description ? (formik.errors.description as string) : undefined
                }
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interactionMode" className="text-sm font-medium">
                Interaction Mode <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formik.values.interactionMode}
                onValueChange={(value) => formik.setFieldValue("interactionMode", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {interactionModes.map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      <div className="flex flex-col">
                        <span className="flex items-center gap-2">
                          <span>{mode.icon}</span>
                          <span>{mode.label}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">{mode.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {
                  interactionModes.find((mode) => mode.value === formik.values.interactionMode)
                    ?.description
                }
              </p>
            </div>
          </div>
        )}
        {/* Step 2: Integration Details */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteUrl" className="text-sm font-medium">
                Site URL <span className="text-red-500">*</span>
              </Label>
              <CustomTextField
                id="siteUrl"
                name="siteUrl"
                placeholder="https://api.example.com"
                value={formik.values.siteUrl}
                onChange={formik.handleChange}
                error={formik.touched.siteUrl && Boolean(formik.errors.siteUrl)}
                helperText={formik.touched.siteUrl ? (formik.errors.siteUrl as string) : undefined}
              />
              <p className="text-xs text-muted-foreground">
                Base URL of the external agent (all endpoints are relative to this)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="executionMode" className="text-sm font-medium">
                Execution Mode <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formik.values.executionMode}
                onValueChange={(value) => formik.setFieldValue("executionMode", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {executionModes.map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="authMethod" className="text-sm font-medium">
                Authentication Method <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formik.values.authMethod}
                onValueChange={(value) => formik.setFieldValue("authMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {authMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(formik.values.authMethod === "jwt" || formik.values.authMethod === "oauth2") && (
              <div className="space-y-2">
                <Label htmlFor="authEndpoint" className="text-sm font-medium">
                  Authentication Endpoint (Optional)
                </Label>
                <CustomTextField
                  id="authEndpoint"
                  name="authEndpoint"
                  placeholder="/api/auth/token"
                  value={formik.values.authEndpoint || ""}
                  onChange={formik.handleChange}
                  helperText="Endpoint to obtain authentication tokens (relative to site URL)"
                />
              </div>
            )}

            {needsCredentials && (
              <CredentialSchemaBuilder fields={credentialFields} onChange={setCredentialFields} />
            )}
          </div>
        )}
        {/* Step 3: Mode-Specific Configuration */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Mode Summary */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Configuration for: {formik.values.interactionMode}
              </h3>
              <p className="text-sm text-blue-700">
                {formik.values.interactionMode === "chat" &&
                  "Configure real-time conversational interface settings"}
                {formik.values.interactionMode === "auto_reply" &&
                  "Configure platform message auto-response settings"}
                {formik.values.interactionMode === "task" &&
                  "Configure input/output task execution settings"}
                {formik.values.interactionMode === "event" &&
                  "Configure scheduled or webhook-triggered event settings"}
                {formik.values.interactionMode === "hybrid" &&
                  "Configure settings for multiple interaction modes"}
              </p>
              {formik.values.interactionMode === "hybrid" && (
                <p className="text-xs text-blue-600 mt-1">
                  Note: For hybrid mode, configure all relevant sections below based on your
                  agent&apos;s capabilities.
                </p>
              )}
            </div>

            {/* Chat Mode Config */}
            {isChatMode && (
              <ChatModeConfig
                executionMode={formik.values.executionMode}
                chatFrontendUrl={formik.values.chatFrontendUrl || ""}
                onChatFrontendUrlChange={(value) => formik.setFieldValue("chatFrontendUrl", value)}
                chatApiEndpoint={formik.values.chatApiEndpoint || ""}
                onChatApiEndpointChange={(value) => formik.setFieldValue("chatApiEndpoint", value)}
                supportsStreaming={formik.values.supportsStreaming || false}
                onSupportsStreamingChange={(value) =>
                  formik.setFieldValue("supportsStreaming", value)
                }
                errors={{
                  chatFrontendUrl: formik.errors.chatFrontendUrl as string,
                  chatApiEndpoint: formik.errors.chatApiEndpoint as string,
                }}
                touched={{
                  chatFrontendUrl: formik.touched.chatFrontendUrl,
                  chatApiEndpoint: formik.touched.chatApiEndpoint,
                }}
              />
            )}

            {/* Task Mode Config */}
            {isTaskMode && (
              <TaskModeConfig
                executeEndpoint={formik.values.executeEndpoint || ""}
                onExecuteEndpointChange={(value) => formik.setFieldValue("executeEndpoint", value)}
                outputFormat={formik.values.outputFormat || "json"}
                onOutputFormatChange={(value) => formik.setFieldValue("outputFormat", value)}
                isAsyncExecution={formik.values.isAsyncExecution || false}
                onIsAsyncExecutionChange={(value) =>
                  formik.setFieldValue("isAsyncExecution", value)
                }
                callbackUrl={formik.values.callbackUrl || ""}
                onCallbackUrlChange={(value) => formik.setFieldValue("callbackUrl", value)}
                inputSchemaFields={inputSchemaFields}
                onInputSchemaFieldsChange={setInputSchemaFields}
                errors={{
                  executeEndpoint: formik.errors.executeEndpoint as string,
                  inputSchema: formik.errors.inputSchema as string,
                  outputFormat: formik.errors.outputFormat as string,
                }}
                touched={{
                  executeEndpoint: formik.touched.executeEndpoint,
                  inputSchema: formik.touched.inputSchema,
                  outputFormat: formik.touched.outputFormat,
                }}
              />
            )}

            {/* Auto-Reply Mode Config */}
            {isAutoReplyMode && (
              <AutoReplyModeConfig
                replyEndpoint={formik.values.replyEndpoint || ""}
                onReplyEndpointChange={(value) => formik.setFieldValue("replyEndpoint", value)}
                platformConfigs={platformConfigs}
                onPlatformConfigsChange={setPlatformConfigs}
                errors={{
                  replyEndpoint: formik.errors.replyEndpoint as string,
                  supportedPlatforms: formik.errors.supportedPlatforms as string,
                }}
                touched={{
                  replyEndpoint: formik.touched.replyEndpoint,
                  supportedPlatforms: formik.touched.supportedPlatforms,
                }}
              />
            )}

            {/* Event Mode Config */}
            {isEventMode && (
              <EventModeConfig
                eventEndpoint={formik.values.eventEndpoint || ""}
                onEventEndpointChange={(value) => formik.setFieldValue("eventEndpoint", value)}
                triggerType={formik.values.triggerType || "schedule"}
                onTriggerTypeChange={(value) => formik.setFieldValue("triggerType", value)}
                scheduleConfig={scheduleConfig}
                onScheduleConfigChange={setScheduleConfig}
                eventConfigs={eventConfigs}
                onEventConfigsChange={setEventConfigs}
                errors={{
                  eventEndpoint: formik.errors.eventEndpoint as string,
                  triggerType: formik.errors.triggerType as string,
                  supportedEvents: formik.errors.supportedEvents as string,
                }}
                touched={{
                  eventEndpoint: formik.touched.eventEndpoint,
                  triggerType: formik.touched.triggerType,
                  supportedEvents: formik.touched.supportedEvents,
                }}
              />
            )}

            {/* Common Fields */}
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <h3 className="font-semibold">Common Configuration</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="healthEndpoint">Health Check Endpoint (Optional)</Label>
                  <CustomTextField
                    id="healthEndpoint"
                    name="healthEndpoint"
                    placeholder="/api/health"
                    value={formik.values.healthEndpoint || ""}
                    onChange={formik.handleChange}
                    helperText="Endpoint to check if your agent is running"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentationUrl">Documentation URL (Optional)</Label>
                  <CustomTextField
                    id="documentationUrl"
                    name="documentationUrl"
                    placeholder="https://docs.example.com/api"
                    value={formik.values.documentationUrl || ""}
                    onChange={formik.handleChange}
                    helperText="Link to your API documentation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rateLimitPerMinute">Rate Limit (per minute)</Label>
                  <CustomTextField
                    id="rateLimitPerMinute"
                    name="rateLimitPerMinute"
                    type="number"
                    placeholder="60"
                    value={formik.values.rateLimitPerMinute || ""}
                    onChange={formik.handleChange}
                    helperText="Maximum requests per minute (default: 60)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeoutSeconds">Timeout (seconds)</Label>
                  <CustomTextField
                    id="timeoutSeconds"
                    name="timeoutSeconds"
                    type="number"
                    placeholder="30"
                    value={formik.values.timeoutSeconds || ""}
                    onChange={formik.handleChange}
                    helperText="Request timeout in seconds (default: 30)"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            type="button"
            variant="ghost"
            onClick={currentStep === 1 ? onCancel : onPrevStep}
            disabled={isSubmitting}
          >
            {currentStep === 1 ? (
              "Cancel"
            ) : (
              <>
                <ArrowLeft size={16} className="mr-2" />
                Back
              </>
            )}
          </Button>

          <div className="text-sm text-muted-foreground">Step {currentStep} of 3</div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : currentStep === 3 ? (
              "Save & Connect"
            ) : (
              <>
                Next
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
