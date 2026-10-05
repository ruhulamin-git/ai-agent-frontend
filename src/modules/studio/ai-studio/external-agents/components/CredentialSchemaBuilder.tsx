import { Plus, Trash2 } from "lucide-react";

import { CustomTextArea, CustomTextField } from "@/shared/form-elements";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

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
  options?: string[]; // For select type
}

interface CredentialSchemaBuilderProps {
  fields: CredentialField[];
  onChange: (fields: CredentialField[]) => void;
}

const credentialFieldTypes = [
  { value: "text", label: "Text", description: "Single line text input" },
  { value: "password", label: "Password", description: "Hidden text input for sensitive data" },
  { value: "email", label: "Email", description: "Email address input with validation" },
  { value: "number", label: "Number", description: "Numeric input only" },
  { value: "url", label: "URL", description: "Web address input with validation" },
  { value: "textarea", label: "Long Text", description: "Multi-line text input" },
  { value: "date", label: "Date", description: "Date picker input" },
  { value: "checkbox", label: "Checkbox", description: "True/false boolean input" },
  { value: "select", label: "Dropdown", description: "Select from predefined options" },
];

export const CredentialSchemaBuilder = ({ fields, onChange }: CredentialSchemaBuilderProps) => {
  const addCredentialField = () => {
    const newField: CredentialField = {
      id: `field_${Date.now()}`,
      name: "",
      label: "",
      type: "text",
      required: false,
      placeholder: "",
      helpText: "",
    };
    onChange([...fields, newField]);
  };

  const removeCredentialField = (id: string) => {
    onChange(fields.filter((field) => field.id !== id));
  };

  const updateCredentialField = (id: string, updates: Partial<CredentialField>) => {
    onChange(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)));
  };

  // Convert credential fields to schema format
  const credentialFieldsToSchema = () => {
    // Filter out empty fields (fields with no name or label)
    const filledFields = fields.filter((field) => field.name.trim() && field.label.trim());

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

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Credential Schema Builder (Optional)</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Define what credential fields subscribers will need to provide. Supports various field
              types like password, email, number, date, etc.
            </p>
          </div>
          {fields.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange([])}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Credential Fields Builder */}
      <div className="space-y-3">
        {fields.map((field, index) => {
          const fieldErrors = [];
          const hasContent = field.name.trim() || field.label.trim();

          // Only show validation errors if field has some content
          if (hasContent) {
            if (!field.name.trim()) fieldErrors.push("Name is required");
            if (!field.label.trim()) fieldErrors.push("Label is required");
            if (field.type === "select" && (!field.options || field.options.length === 0)) {
              fieldErrors.push("Select type requires options");
            }
            const duplicates = fields.filter(
              (f) => f.name.trim() === field.name.trim() && f.id !== field.id && f.name.trim()
            );
            if (duplicates.length > 0) fieldErrors.push(`Duplicate field name "${field.name}"`);
          }

          return (
            <div key={field.id} className="p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">
                  Field {index + 1}
                  {fieldErrors.length > 0 && (
                    <span className="text-red-500 text-xs ml-2">
                      ({fieldErrors.length} error{fieldErrors.length > 1 ? "s" : ""})
                    </span>
                  )}
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCredentialField(field.id)}
                  className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                >
                  <Trash2 size={14} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Field Name */}
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Field Name *</Label>
                  <CustomTextField
                    placeholder="e.g., api_key, username, token"
                    value={field.name}
                    onChange={(e) => updateCredentialField(field.id, { name: e.target.value })}
                    className="text-sm"
                    error={hasContent && !field.name.trim() ? true : false}
                    helperText={hasContent && !field.name.trim() ? "Name is required" : undefined}
                  />
                </div>

                {/* Field Label */}
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Display Label *</Label>
                  <CustomTextField
                    placeholder="e.g., API Key, Username, Access Token"
                    value={field.label}
                    onChange={(e) => updateCredentialField(field.id, { label: e.target.value })}
                    className="text-sm"
                    error={hasContent && !field.label.trim() ? true : false}
                    helperText={hasContent && !field.label.trim() ? "Label is required" : undefined}
                  />
                </div>

                {/* Field Type */}
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Field Type</Label>
                  <Select
                    value={field.type}
                    onValueChange={(value) =>
                      updateCredentialField(field.id, { type: value as CredentialField["type"] })
                    }
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {credentialFieldTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex flex-col">
                            <span>{type.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {type.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Placeholder */}
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Placeholder (Optional)</Label>
                  <CustomTextField
                    placeholder="e.g., Enter your credentials here"
                    value={field.placeholder || ""}
                    onChange={(e) =>
                      updateCredentialField(field.id, { placeholder: e.target.value })
                    }
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Help Text */}
              <div className="space-y-1 mt-3">
                <Label className="text-xs font-medium">Help Text (Optional)</Label>
                <CustomTextField
                  placeholder="e.g., You can find this in your account settings"
                  value={field.helpText || ""}
                  onChange={(e) => updateCredentialField(field.id, { helpText: e.target.value })}
                  className="text-sm"
                />
              </div>

              {/* Options for Select Type */}
              {field.type === "select" && (
                <div className="space-y-1 mt-3">
                  <Label className="text-xs font-medium">Options (One per line) *</Label>
                  <CustomTextArea
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    value={field.options?.join("\n") || ""}
                    onChange={(e) => {
                      const options = e.target.value.split("\n").filter((opt) => opt.trim());
                      updateCredentialField(field.id, { options });
                    }}
                    rows={3}
                    className="text-sm"
                  />
                </div>
              )}

              {/* Required Checkbox */}
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="checkbox"
                  id={`required-${field.id}`}
                  checked={field.required}
                  onChange={(e) => updateCredentialField(field.id, { required: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor={`required-${field.id}`} className="text-xs cursor-pointer">
                  Required field
                </Label>
              </div>
            </div>
          );
        })}

        {/* Add Field Button */}
        <Button
          type="button"
          variant="outline"
          onClick={addCredentialField}
          className="w-full h-10 border-dashed"
        >
          <Plus size={16} className="mr-2" />
          Add Credential Field
        </Button>

        {/* Preview */}
        {fields.length > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="text-xs font-medium text-blue-900 mb-2">Preview:</h5>
            <div className="text-xs text-blue-700 font-mono">
              {JSON.stringify(credentialFieldsToSchema(), null, 2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
