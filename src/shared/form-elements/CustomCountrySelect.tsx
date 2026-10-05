"use client";

import * as React from "react";

import { CustomAutoComplete } from "./CustomAutoComplete";

interface CustomCountrySelectProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  id?: string;
}

export const CustomCountrySelect = (props: CustomCountrySelectProps) => {
  return (
    <CustomAutoComplete
      {...props}
      placeholder={props.placeholder || "Choose a country..."}
      emptyMessage="No country found."
    />
  );
};
