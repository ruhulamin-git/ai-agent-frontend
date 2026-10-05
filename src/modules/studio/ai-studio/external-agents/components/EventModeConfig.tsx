import { CustomTextField } from "@/shared/form-elements";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

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

interface EventModeConfigProps {
  eventEndpoint: string;
  onEventEndpointChange: (value: string) => void;
  triggerType: string;
  onTriggerTypeChange: (value: string) => void;
  scheduleConfig: ScheduleConfig;
  onScheduleConfigChange: (config: ScheduleConfig) => void;
  eventConfigs: EventConfig[];
  onEventConfigsChange: (configs: EventConfig[]) => void;
  errors?: {
    eventEndpoint?: string;
    triggerType?: string;
    supportedEvents?: string;
  };
  touched?: {
    eventEndpoint?: boolean;
    triggerType?: boolean;
    supportedEvents?: boolean;
  };
}

export const EventModeConfig = ({
  eventEndpoint,
  onEventEndpointChange,
  triggerType,
  onTriggerTypeChange,
  scheduleConfig,
  onScheduleConfigChange,
  eventConfigs,
  onEventConfigsChange,
  errors,
  touched,
}: EventModeConfigProps) => {
  const updateEventConfig = (id: string, updates: Partial<EventConfig>) => {
    const updatedConfigs = eventConfigs.map((config) =>
      config.id === id ? { ...config, ...updates } : config
    );
    onEventConfigsChange(updatedConfigs);
  };

  const getEnabledEvents = () => {
    return eventConfigs.filter((config) => config.enabled).map((config) => config.eventType);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold flex items-center gap-2">🔔 Event Mode Configuration</h3>

      <div className="space-y-2">
        <Label htmlFor="eventEndpoint">
          Event Endpoint <span className="text-red-500">*</span>
        </Label>
        <CustomTextField
          id="eventEndpoint"
          name="eventEndpoint"
          placeholder="/api/trigger"
          value={eventEndpoint}
          onChange={(e) => onEventEndpointChange(e.target.value)}
          error={touched?.eventEndpoint && Boolean(errors?.eventEndpoint)}
          helperText={
            touched?.eventEndpoint && errors?.eventEndpoint
              ? errors.eventEndpoint
              : "API endpoint for event triggers (relative to site URL)"
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="triggerType">
          Trigger Type <span className="text-red-500">*</span>
        </Label>
        <Select value={triggerType} onValueChange={onTriggerTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="schedule">Schedule (Cron)</SelectItem>
            <SelectItem value="webhook">Webhook</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {triggerType === "schedule" && (
        <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
          <h4 className="text-sm font-medium">Schedule Configuration</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Cron Expression</Label>
              <CustomTextField
                placeholder="0 9 * * *"
                value={scheduleConfig.cron}
                onChange={(e) =>
                  onScheduleConfigChange({ ...scheduleConfig, cron: e.target.value })
                }
                className="text-sm font-mono"
              />
              <p className="text-xs text-muted-foreground">Format: minute hour day month weekday</p>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Timezone</Label>
              <Select
                value={scheduleConfig.timezone}
                onValueChange={(value) =>
                  onScheduleConfigChange({ ...scheduleConfig, timezone: value })
                }
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">America/New_York</SelectItem>
                  <SelectItem value="Europe/London">Europe/London</SelectItem>
                  <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                  <SelectItem value="Asia/Dhaka">Asia/Dhaka</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium">Description (Optional)</Label>
            <CustomTextField
              placeholder="e.g., Daily at 9 AM UTC"
              value={scheduleConfig.description || ""}
              onChange={(e) =>
                onScheduleConfigChange({ ...scheduleConfig, description: e.target.value })
              }
              className="text-sm"
            />
          </div>

          <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
            <strong>Preview:</strong>{" "}
            {scheduleConfig.description ||
              `Cron: ${scheduleConfig.cron} (${scheduleConfig.timezone})`}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>
          Event Types <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-muted-foreground mb-3">
          Select which event types your agent can handle
        </p>

        <div className="space-y-2">
          {eventConfigs.map((config) => (
            <div
              key={config.id}
              className="flex items-center justify-between p-2 border rounded-lg bg-muted/30"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`event-${config.eventType}`}
                  checked={config.enabled}
                  onChange={(e) => updateEventConfig(config.id, { enabled: e.target.checked })}
                  className="rounded"
                />
                <div>
                  <Label
                    htmlFor={`event-${config.eventType}`}
                    className="cursor-pointer font-medium text-sm"
                  >
                    {config.eventType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Label>
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {getEnabledEvents().length === 0 && (
          <p className="text-sm text-red-500 mt-2">Please select at least one event type</p>
        )}

        {getEnabledEvents().length > 0 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg mt-3">
            <h5 className="text-xs font-medium text-green-900 mb-1">Selected Events:</h5>
            <div className="text-xs text-green-700">{getEnabledEvents().join(", ")}</div>
          </div>
        )}
      </div>
    </div>
  );
};
