"use client";

import React from "react";
import { useTranslation } from "react-i18next";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

interface ChatConfigSectionProps {
  executionMode: string;
  chatFrontendUrl: string;
  setChatFrontendUrl: (value: string) => void;
  chatApiEndpoint: string;
  setChatApiEndpoint: (value: string) => void;
  supportsStreaming: boolean;
  setSupportsStreaming: (value: boolean) => void;
  chatApiRequestFormat: string;
  setChatApiRequestFormat: (value: string) => void;
  chatApiResponseFormat: string;
  setChatApiResponseFormat: (value: string) => void;
}

export const ChatConfigSection = ({
  executionMode,
  chatFrontendUrl,
  setChatFrontendUrl,
  chatApiEndpoint,
  setChatApiEndpoint,
  supportsStreaming,
  setSupportsStreaming,
  chatApiRequestFormat,
  setChatApiRequestFormat,
  chatApiResponseFormat,
  setChatApiResponseFormat,
}: ChatConfigSectionProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {t("pages.external_agent_settings.general.chat_config", "Chat Configuration")}
      </h3>
      <p className="text-muted-foreground text-sm mb-6">
        {t(
          "pages.external_agent_settings.general.chat_config_description",
          "Configure chat-specific settings"
        )}
      </p>

      <div className="grid grid-cols-1 gap-5">
        {executionMode === "redirect" && (
          <div>
            <Label htmlFor="chat-frontend-url" className="mb-1.5 block">
              {t("pages.external_agent_settings.general.chat_frontend_url", "Chat Frontend URL")}
            </Label>
            <Input
              id="chat-frontend-url"
              value={chatFrontendUrl}
              onChange={(e) => setChatFrontendUrl(e.target.value)}
              placeholder="https://chat.example.com"
            />
          </div>
        )}

        {executionMode === "proxied" && (
          <>
            <div>
              <Label htmlFor="chat-api-endpoint" className="mb-1.5 block">
                {t("pages.external_agent_settings.general.chat_api_endpoint", "Chat API Endpoint")}
              </Label>
              <Input
                id="chat-api-endpoint"
                value={chatApiEndpoint}
                onChange={(e) => setChatApiEndpoint(e.target.value)}
                placeholder="https://api.example.com/chat"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="supports-streaming"
                checked={supportsStreaming}
                onChange={(e) => setSupportsStreaming(e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="supports-streaming" className="cursor-pointer">
                {t(
                  "pages.external_agent_settings.general.supports_streaming",
                  "Supports Streaming"
                )}
              </Label>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="chat-request-format" className="mb-1.5 block">
                {t(
                  "pages.external_agent_settings.general.chat_request_format",
                  "Chat API Request Format (JSON)"
                )}
              </Label>
              <Textarea
                id="chat-request-format"
                value={chatApiRequestFormat}
                onChange={(e) => setChatApiRequestFormat(e.target.value)}
                placeholder='{"message": "{{message}}", "user_id": "{{user_id}}"}'
                rows={4}
                className="font-mono text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="chat-response-format" className="mb-1.5 block">
                {t(
                  "pages.external_agent_settings.general.chat_response_format",
                  "Chat API Response Format (JSON)"
                )}
              </Label>
              <Textarea
                id="chat-response-format"
                value={chatApiResponseFormat}
                onChange={(e) => setChatApiResponseFormat(e.target.value)}
                placeholder='{"response": "{{response}}", "status": "success"}'
                rows={4}
                className="font-mono text-sm"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface TaskConfigSectionProps {
  executeEndpoint: string;
  setExecuteEndpoint: (value: string) => void;
  outputFormat: string;
  setOutputFormat: (value: "text" | "json" | "file" | "html" | "markdown") => void;
  isAsyncExecution: boolean;
  setIsAsyncExecution: (value: boolean) => void;
  callbackUrl: string;
  setCallbackUrl: (value: string) => void;
  inputSchema: string;
  setInputSchema: (value: string) => void;
}

export const TaskConfigSection = ({
  executeEndpoint,
  setExecuteEndpoint,
  outputFormat,
  setOutputFormat,
  isAsyncExecution,
  setIsAsyncExecution,
  callbackUrl,
  setCallbackUrl,
  inputSchema,
  setInputSchema,
}: TaskConfigSectionProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {t("pages.external_agent_settings.general.task_config", "Task Configuration")}
      </h3>
      <p className="text-muted-foreground text-sm mb-6">
        {t(
          "pages.external_agent_settings.general.task_config_description",
          "Configure task execution settings"
        )}
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="execute-endpoint" className="mb-1.5 block">
            {t("pages.external_agent_settings.general.execute_endpoint", "Execute Endpoint")}
          </Label>
          <Input
            id="execute-endpoint"
            value={executeEndpoint}
            onChange={(e) => setExecuteEndpoint(e.target.value)}
            placeholder="https://api.example.com/execute"
          />
        </div>

        <div>
          <Label htmlFor="output-format" className="mb-1.5 block">
            {t("pages.external_agent_settings.general.output_format", "Output Format")}
          </Label>
          <Select value={outputFormat} onValueChange={setOutputFormat}>
            <SelectTrigger id="output-format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="file">File</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="markdown">Markdown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is-async"
            checked={isAsyncExecution}
            onChange={(e) => setIsAsyncExecution(e.target.checked)}
            className="w-4 h-4"
          />
          <Label htmlFor="is-async" className="cursor-pointer">
            {t("pages.external_agent_settings.general.is_async_execution", "Async Execution")}
          </Label>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="callback-url" className="mb-1.5 block">
            {t("pages.external_agent_settings.general.callback_url", "Callback URL")}
          </Label>
          <Input
            id="callback-url"
            value={callbackUrl}
            onChange={(e) => setCallbackUrl(e.target.value)}
            placeholder="https://api.example.com/callback"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="input-schema" className="mb-1.5 block">
            {t("pages.external_agent_settings.general.input_schema", "Input Schema (JSON)")}
          </Label>
          <Textarea
            id="input-schema"
            value={inputSchema}
            onChange={(e) => setInputSchema(e.target.value)}
            placeholder='{"type": "object", "required": ["topic"], "properties": {"topic": {"type": "string", "description": "Main topic"}}}'
            rows={6}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {t(
              "pages.external_agent_settings.general.input_schema_hint",
              "Define the JSON schema for task inputs"
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
