"use client";

import { CustomTextField } from "@/shared/form-elements";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";

import type { WidgetBehavior } from "../types";

interface BehaviorSectionProps {
  behavior: WidgetBehavior;
  onUpdate: (key: keyof WidgetBehavior, value: boolean | number) => void;
}

export const BehaviorSection = ({ behavior, onUpdate }: BehaviorSectionProps) => {
  return (
    <section>
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-base text-muted-foreground">tune</span>
        <h3 className="text-sm font-medium text-foreground">Behavior</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-5">
        Configure how the widget behaves on your site.
      </p>

      <div className="grid grid-cols-1 gap-5 max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Auto Open</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Automatically open when the page loads
            </p>
          </div>
          <Switch
            checked={behavior.autoOpen}
            onCheckedChange={(checked) => onUpdate("autoOpen", checked)}
          />
        </div>

        {behavior.autoOpen && (
          <div className="max-w-xs">
            <Label
              htmlFor="autoOpenDelay"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Auto Open Delay (ms)
            </Label>
            <CustomTextField
              id="autoOpenDelay"
              type="number"
              min={0}
              step={500}
              value={behavior.autoOpenDelay}
              onChange={(e) => onUpdate("autoOpenDelay", Number(e.target.value))}
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Sound Notifications</p>
            <p className="text-xs text-muted-foreground mt-0.5">Play a sound for new messages</p>
          </div>
          <Switch
            checked={behavior.soundEnabled}
            onCheckedChange={(checked) => onUpdate("soundEnabled", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Typing Indicator</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Show animation while the agent responds
            </p>
          </div>
          <Switch
            checked={behavior.typingIndicator}
            onCheckedChange={(checked) => onUpdate("typingIndicator", checked)}
          />
        </div>
      </div>
    </section>
  );
};
