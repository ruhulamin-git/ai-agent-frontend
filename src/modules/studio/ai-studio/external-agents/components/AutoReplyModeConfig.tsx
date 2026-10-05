import { CustomTextField } from "@/shared/form-elements";
import { Label } from "@/shared/ui/label";

interface PlatformConfig {
  id: string;
  platform: "telegram" | "whatsapp" | "messenger" | "instagram";
  enabled: boolean;
  config?: Record<string, any>;
}

interface AutoReplyModeConfigProps {
  replyEndpoint: string;
  onReplyEndpointChange: (value: string) => void;
  platformConfigs: PlatformConfig[];
  onPlatformConfigsChange: (configs: PlatformConfig[]) => void;
  errors?: {
    replyEndpoint?: string;
    supportedPlatforms?: string;
  };
  touched?: {
    replyEndpoint?: boolean;
    supportedPlatforms?: boolean;
  };
}

export const AutoReplyModeConfig = ({
  replyEndpoint,
  onReplyEndpointChange,
  platformConfigs,
  onPlatformConfigsChange,
  errors,
  touched,
}: AutoReplyModeConfigProps) => {
  const updatePlatformConfig = (id: string, updates: Partial<PlatformConfig>) => {
    const updatedConfigs = platformConfigs.map((config) =>
      config.id === id ? { ...config, ...updates } : config
    );
    onPlatformConfigsChange(updatedConfigs);
  };

  const getEnabledPlatforms = () => {
    return platformConfigs.filter((config) => config.enabled).map((config) => config.platform);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold flex items-center gap-2">⚡ Auto-Reply Mode Configuration</h3>

      <div className="space-y-2">
        <Label htmlFor="replyEndpoint">
          Reply Endpoint <span className="text-red-500">*</span>
        </Label>
        <CustomTextField
          id="replyEndpoint"
          name="replyEndpoint"
          placeholder="/api/reply"
          value={replyEndpoint}
          onChange={(e) => onReplyEndpointChange(e.target.value)}
          error={touched?.replyEndpoint && Boolean(errors?.replyEndpoint)}
          helperText={
            touched?.replyEndpoint && errors?.replyEndpoint
              ? errors.replyEndpoint
              : "API endpoint for auto-reply functionality (relative to site URL)"
          }
        />
      </div>

      <div className="space-y-2">
        <Label>
          Platform Configuration <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-muted-foreground mb-3">
          Select and configure the platforms where your agent will auto-reply to messages
        </p>

        <div className="space-y-3">
          {platformConfigs.map((config) => (
            <div key={config.id} className="p-3 border rounded-lg bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`platform-${config.platform}`}
                    checked={config.enabled}
                    onChange={(e) => updatePlatformConfig(config.id, { enabled: e.target.checked })}
                    className="rounded"
                  />
                  <Label
                    htmlFor={`platform-${config.platform}`}
                    className="cursor-pointer capitalize font-medium"
                  >
                    {config.platform}
                  </Label>
                </div>
                <span className="text-xs text-muted-foreground">
                  {config.platform === "telegram" && "Bot API integration"}
                  {config.platform === "whatsapp" && "Business API integration"}
                  {config.platform === "messenger" && "Facebook Messenger API"}
                  {config.platform === "instagram" && "Instagram Direct API"}
                </span>
              </div>

              {config.enabled && (
                <div className="mt-2 text-xs text-green-700 bg-green-50 p-2 rounded">
                  ✓ {config.platform.charAt(0).toUpperCase() + config.platform.slice(1)} integration
                  enabled
                </div>
              )}
            </div>
          ))}
        </div>

        {getEnabledPlatforms().length === 0 && (
          <p className="text-sm text-red-500 mt-2">
            Please select at least one platform for auto-reply functionality
          </p>
        )}

        {getEnabledPlatforms().length > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mt-3">
            <h5 className="text-xs font-medium text-blue-900 mb-1">Selected Platforms:</h5>
            <div className="text-xs text-blue-700">{getEnabledPlatforms().join(", ")}</div>
          </div>
        )}
      </div>
    </div>
  );
};
