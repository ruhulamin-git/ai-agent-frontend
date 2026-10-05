"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium text-muted-foreground  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

export interface LabelProps
  extends React.ComponentProps<"label">,
    VariantProps<typeof labelVariants> {}

const Label = ({ className, ...props }: LabelProps) => {
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  return <label data-slot="label" className={cn(labelVariants(), className)} {...props} />;
};

export { Label, labelVariants };
