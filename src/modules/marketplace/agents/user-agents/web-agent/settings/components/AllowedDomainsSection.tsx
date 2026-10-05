"use client";

import { CustomTextField } from "@/shared/form-elements";
import { Button } from "@/shared/ui/button";

interface AllowedDomainsSectionProps {
  domains: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
}

export const AllowedDomainsSection = ({
  domains,
  onAdd,
  onRemove,
  onUpdate,
}: AllowedDomainsSectionProps) => {
  return (
    <section>
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-base text-muted-foreground">language</span>
        <h3 className="text-sm font-medium text-foreground">Allowed Domains</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Specify which domains are allowed to embed the widget. Use{" "}
        <code className="text-[11px] font-mono bg-muted px-1 py-0.5 rounded">*</code> for wildcards.
      </p>

      <div className="max-w-2xl space-y-2">
        {domains.length === 0 && (
          <p className="text-xs text-muted-foreground italic py-2">
            No domains added yet. Click &quot;Add Domain&quot; to allow embedding.
          </p>
        )}

        {domains.map((domain, index) => (
          <div key={`domain-${String(index)}`} className="flex items-center gap-2">
            <CustomTextField
              value={domain}
              onChange={(e) => onUpdate(index, e.target.value)}
              placeholder="e.g. example.com or *.example.com"
              className="font-mono text-[13px] flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
              className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </Button>
          </div>
        ))}

        <Button type="button" variant="outline" size="sm" onClick={onAdd} className="h-8 mt-1">
          <span className="material-symbols-outlined text-base mr-1.5">add</span>
          Add Domain
        </Button>
      </div>
    </section>
  );
};
