"use client";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import type { ReactNode } from "react";

interface FormDialogProps {
  /** Controls whether the dialog is open */
  open: boolean;
  /** Callback when the open state changes (close via overlay / X / cancel) */
  onOpenChange: (open: boolean) => void;
  /** Dialog title text */
  title: string;
  /** Optional description shown below the title */
  description?: string;
  /** The form body rendered inside the dialog */
  children: ReactNode;
  /** Primary action label (e.g. "Create", "Save") */
  submitLabel?: string;
  /** Loading state label (e.g. "Creating…", "Saving…") */
  submitLoadingLabel?: string;
  /** Called when the primary action button is clicked */
  onSubmit: () => void;
  /** Disables the submit button when true */
  isSubmitting?: boolean;
  /** Cancel button label — defaults to "Cancel" */
  cancelLabel?: string;
  /** Optional className applied to DialogContent */
  className?: string;
}

export const FormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  submitLabel = "Submit",
  submitLoadingLabel,
  onSubmit,
  isSubmitting = false,
  cancelLabel = "Cancel",
  className,
}: FormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="py-2">{children}</div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </Button>
          <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? submitLoadingLabel ?? submitLabel : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
