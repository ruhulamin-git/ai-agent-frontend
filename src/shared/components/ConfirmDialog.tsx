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

interface ConfirmDialogProps {
  /** Controls whether the dialog is open */
  open: boolean;
  /** Callback when the open state changes */
  onOpenChange: (open: boolean) => void;
  /** Dialog title */
  title: string;
  /** Description / body text */
  description: string;
  /** Confirm button label — defaults to "Confirm" */
  confirmLabel?: string;
  /** Loading-state label shown while action is in progress */
  confirmLoadingLabel?: string;
  /** Called when the confirm button is clicked */
  onConfirm: () => void;
  /** Disables the confirm button when true */
  isConfirming?: boolean;
  /** Cancel button label — defaults to "Cancel" */
  cancelLabel?: string;
  /** Visual variant — "destructive" makes the confirm button red */
  variant?: "default" | "destructive";
  /** Optional className applied to DialogContent */
  className?: string;
}

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  confirmLoadingLabel,
  onConfirm,
  isConfirming = false,
  cancelLabel = "Cancel",
  variant = "default",
  className,
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isConfirming}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? confirmLoadingLabel ?? confirmLabel : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
