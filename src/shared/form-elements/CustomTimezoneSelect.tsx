"use client";

import * as React from "react";

import { CustomAutoComplete } from "./CustomAutoComplete";

interface CustomTimezoneSelectProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  id?: string;
}

export const CustomTimezoneSelect = (props: CustomTimezoneSelectProps) => {
  return (
    <CustomAutoComplete
      {...props}
      placeholder={props.placeholder || "Choose a timezone..."}
      emptyMessage="No timezone found."
    />
  );
};
