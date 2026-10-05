import { CustomTextField } from "@/shared/form-elements";
import { Label } from "@/shared/ui/label";

interface ChatModeConfigProps {
  executionMode: "redirect" | "proxied" | "api_call";
  chatFrontendUrl: string;
  onChatFrontendUrlChange: (value: string) => void;
  chatApiEndpoint: string;
  onChatApiEndpointChange: (value: string) => void;
  supportsStreaming: boolean;
  onSupportsStreamingChange: (value: boolean) => void;
  errors?: {
    chatFrontendUrl?: string;
    chatApiEndpoint?: string;
  };
  touched?: {
    chatFrontendUrl?: boolean;
    chatApiEndpoint?: boolean;
  };
}

export const ChatModeConfig = ({
  executionMode,
  chatFrontendUrl,
  onChatFrontendUrlChange,
  chatApiEndpoint,
  onChatApiEndpointChange,
  supportsStreaming,
  onSupportsStreamingChange,
  errors,
  touched,
}: ChatModeConfigProps) => {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold flex items-center gap-2">💬 Chat Mode Configuration</h3>

      {executionMode === "redirect" && (
        <div className="space-y-2">
          <Label htmlFor="chatFrontendUrl">
            Chat Frontend URL <span className="text-red-500">*</span>
          </Label>
          <CustomTextField
            id="chatFrontendUrl"
            name="chatFrontendUrl"
            placeholder="https://chat.example.com"
            value={chatFrontendUrl}
            onChange={(e) => onChatFrontendUrlChange(e.target.value)}
            error={touched?.chatFrontendUrl && Boolean(errors?.chatFrontendUrl)}
            helperText={
              touched?.chatFrontendUrl && errors?.chatFrontendUrl
                ? errors.chatFrontendUrl
                : "URL where users will be redirected to chat with your agent"
            }
          />
        </div>
      )}

      {executionMode === "proxied" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="chatApiEndpoint">
              Chat API Endpoint <span className="text-red-500">*</span>
            </Label>
            <CustomTextField
              id="chatApiEndpoint"
              name="chatApiEndpoint"
              placeholder="/api/chat"
              value={chatApiEndpoint}
              onChange={(e) => onChatApiEndpointChange(e.target.value)}
              error={touched?.chatApiEndpoint && Boolean(errors?.chatApiEndpoint)}
              helperText={
                touched?.chatApiEndpoint && errors?.chatApiEndpoint
                  ? errors.chatApiEndpoint
                  : "API endpoint for chat requests (relative to site URL)"
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="supportsStreaming"
              checked={supportsStreaming}
              onChange={(e) => onSupportsStreamingChange(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="supportsStreaming" className="cursor-pointer">
              Supports Streaming
            </Label>
          </div>
        </>
      )}
    </div>
  );
};
