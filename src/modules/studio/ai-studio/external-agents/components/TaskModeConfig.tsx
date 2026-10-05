import { CustomTextField } from "@/shared/form-elements";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

import { InputSchemaBuilder } from "./InputSchemaBuilder";

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

interface TaskModeConfigProps {
  executeEndpoint: string;
  onExecuteEndpointChange: (value: string) => void;
  outputFormat: string;
  onOutputFormatChange: (value: string) => void;
  isAsyncExecution: boolean;
  onIsAsyncExecutionChange: (value: boolean) => void;
  callbackUrl: string;
  onCallbackUrlChange: (value: string) => void;
  inputSchemaFields: InputSchemaField[];
  onInputSchemaFieldsChange: (fields: InputSchemaField[]) => void;
  errors?: {
    executeEndpoint?: string;
    inputSchema?: string;
    outputFormat?: string;
  };
  touched?: {
    executeEndpoint?: boolean;
    inputSchema?: boolean;
    outputFormat?: boolean;
  };
}

export const TaskModeConfig = ({
  executeEndpoint,
  onExecuteEndpointChange,
  outputFormat,
  onOutputFormatChange,
  isAsyncExecution,
  onIsAsyncExecutionChange,
  callbackUrl,
  onCallbackUrlChange,
  inputSchemaFields,
  onInputSchemaFieldsChange,
  errors,
  touched,
}: TaskModeConfigProps) => {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold flex items-center gap-2">📋 Task Mode Configuration</h3>

      <div className="space-y-2">
        <Label htmlFor="executeEndpoint">
          Execute Endpoint <span className="text-red-500">*</span>
        </Label>
        <CustomTextField
          id="executeEndpoint"
          name="executeEndpoint"
          placeholder="/api/execute"
          value={executeEndpoint}
          onChange={(e) => onExecuteEndpointChange(e.target.value)}
          error={touched?.executeEndpoint && Boolean(errors?.executeEndpoint)}
          helperText={
            touched?.executeEndpoint && errors?.executeEndpoint
              ? errors.executeEndpoint
              : "API endpoint for task execution (relative to site URL)"
          }
        />
      </div>

      <InputSchemaBuilder fields={inputSchemaFields} onChange={onInputSchemaFieldsChange} />

      <div className="space-y-2">
        <Label htmlFor="outputFormat">
          Output Format <span className="text-red-500">*</span>
        </Label>
        <Select value={outputFormat} onValueChange={onOutputFormatChange}>
          <SelectTrigger>
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
          id="isAsyncExecution"
          checked={isAsyncExecution}
          onChange={(e) => onIsAsyncExecutionChange(e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="isAsyncExecution" className="cursor-pointer">
          Async Execution (returns task ID)
        </Label>
      </div>

      {isAsyncExecution && (
        <div className="space-y-2">
          <Label htmlFor="callbackUrl">Callback URL (Optional)</Label>
          <CustomTextField
            id="callbackUrl"
            name="callbackUrl"
            placeholder="https://platform.example.com/api/webhooks/callback"
            value={callbackUrl}
            onChange={(e) => onCallbackUrlChange(e.target.value)}
            helperText="URL to receive task completion notifications"
          />
        </div>
      )}
    </div>
  );
};
