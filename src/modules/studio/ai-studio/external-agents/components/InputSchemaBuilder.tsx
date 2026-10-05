import { Plus, Trash2 } from "lucide-react";

import { CustomTextField } from "@/shared/form-elements";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

interface InputSchemaField {
  id: string;
  name: string;
  label: string;
  type: "string" | "number" | "integer" | "boolean" | "array" | "object";
  required: boolean;
  description?: string;
  minimum?: number;
  maximum?: number;
  items?: { type: string }; // For array type
}

interface InputSchemaBuilderProps {
  fields: InputSchemaField[];
  onChange: (fields: InputSchemaField[]) => void;
}

const inputSchemaFieldTypes = [
  { value: "string", label: "Text", description: "Text input field" },
  { value: "number", label: "Number", description: "Decimal number input" },
  { value: "integer", label: "Integer", description: "Whole number input" },
  { value: "boolean", label: "Boolean", description: "True/false checkbox" },
  { value: "array", label: "Array", description: "List of items" },
  { value: "object", label: "Object", description: "Nested object" },
];

export const InputSchemaBuilder = ({ fields, onChange }: InputSchemaBuilderProps) => {
  const addInputSchemaField = () => {
    const newField: InputSchemaField = {
      id: `input_field_${Date.now()}`,
      name: "",
      label: "",
      type: "string",
      required: false,
      description: "",
    };
    onChange([...fields, newField]);
  };

  const removeInputSchemaField = (id: string) => {
    onChange(fields.filter((field) => field.id !== id));
  };

  const updateInputSchemaField = (id: string, updates: Partial<InputSchemaField>) => {
    onChange(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)));
  };

  // Convert input schema fields to JSON schema format
  const inputSchemaFieldsToSchema = () => {
    const filledFields = fields.filter((field) => field.name.trim() && field.label.trim());

    if (filledFields.length === 0) return {};

    const properties: Record<string, Record<string, unknown>> = {};
    const required: string[] = [];

    filledFields.forEach((field) => {
      const property: Record<string, unknown> = {
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

  return (
    <div className="space-y-2">
      <Label>
        Input Schema Builder <span className="text-red-500">*</span>
      </Label>
      <p className="text-xs text-muted-foreground">
        Define what input fields your task agent expects. Users will fill these when executing
        tasks.
      </p>

      {/* Input Schema Fields Builder */}
      <div className="space-y-3">
        {fields.map((field, index) => {
          const fieldErrors = [];
          const hasContent = field.name.trim() || field.label.trim();

          if (hasContent) {
            if (!field.name.trim()) fieldErrors.push("Name is required");
            if (!field.label.trim()) fieldErrors.push("Label is required");
            const duplicates = fields.filter(
              (f) => f.name.trim() === field.name.trim() && f.id !== field.id && f.name.trim()
            );
            if (duplicates.length > 0) fieldErrors.push(`Duplicate field name "${field.name}"`);
          }

          return (
            <div key={field.id} className="p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">
                  Input Field {index + 1}
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
                  onClick={() => removeInputSchemaField(field.id)}
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
                    placeholder="e.g., topic, keywords, word_count"
                    value={field.name}
                    onChange={(e) => updateInputSchemaField(field.id, { name: e.target.value })}
                    className="text-sm"
                    error={hasContent && !field.name.trim() ? true : false}
                    helperText={hasContent && !field.name.trim() ? "Name is required" : undefined}
                  />
                </div>

                {/* Field Label */}
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Display Label *</Label>
                  <CustomTextField
                    placeholder="e.g., Content Topic, Keywords, Word Count"
                    value={field.label}
                    onChange={(e) => updateInputSchemaField(field.id, { label: e.target.value })}
                    className="text-sm"
                    error={hasContent && !field.label.trim() ? true : false}
                    helperText={hasContent && !field.label.trim() ? "Label is required" : undefined}
                  />
                </div>

                {/* Field Type */}
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Data Type</Label>
                  <Select
                    value={field.type}
                    onValueChange={(value) =>
                      updateInputSchemaField(field.id, { type: value as InputSchemaField["type"] })
                    }
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {inputSchemaFieldTypes.map((type) => (
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

                {/* Description */}
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Description (Optional)</Label>
                  <CustomTextField
                    placeholder="e.g., Main topic for content generation"
                    value={field.description || ""}
                    onChange={(e) =>
                      updateInputSchemaField(field.id, { description: e.target.value })
                    }
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Number constraints */}
              {(field.type === "number" || field.type === "integer") && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Minimum Value (Optional)</Label>
                    <CustomTextField
                      type="number"
                      placeholder="0"
                      value={field.minimum?.toString() || ""}
                      onChange={(e) =>
                        updateInputSchemaField(field.id, {
                          minimum: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Maximum Value (Optional)</Label>
                    <CustomTextField
                      type="number"
                      placeholder="1000"
                      value={field.maximum?.toString() || ""}
                      onChange={(e) =>
                        updateInputSchemaField(field.id, {
                          maximum: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      className="text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Array item type */}
              {field.type === "array" && (
                <div className="space-y-1 mt-3">
                  <Label className="text-xs font-medium">Array Item Type</Label>
                  <Select
                    value={field.items?.type || "string"}
                    onValueChange={(value) =>
                      updateInputSchemaField(field.id, {
                        items: { type: value },
                      })
                    }
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="integer">Integer</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Required Checkbox */}
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="checkbox"
                  id={`input-required-${field.id}`}
                  checked={field.required}
                  onChange={(e) => updateInputSchemaField(field.id, { required: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor={`input-required-${field.id}`} className="text-xs cursor-pointer">
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
          onClick={addInputSchemaField}
          className="w-full h-10 border-dashed"
        >
          <Plus size={16} className="mr-2" />
          Add Input Field
        </Button>

        {/* Preview */}
        {fields.length > 0 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <h5 className="text-xs font-medium text-green-900 mb-2">Generated Schema Preview:</h5>
            <div className="text-xs text-green-700 font-mono">
              {JSON.stringify(inputSchemaFieldsToSchema(), null, 2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
