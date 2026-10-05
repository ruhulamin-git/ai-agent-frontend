"use client";

import { AlertCircle, Building, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

interface RequestPayoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableBalance: number;
  onRequest: (amount: number, method: "paypal" | "bank_transfer", destination: string) => void;
}

export const RequestPayoutDialog = ({
  open,
  onOpenChange,
  availableBalance,
  onRequest,
}: RequestPayoutDialogProps) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<number | "">("");
  const [method, setMethod] = useState<"paypal" | "bank_transfer">("paypal");
  const [destination, setDestination] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsedAmount = typeof amount === "number" ? amount : 0;
  const isAmountValid = parsedAmount >= 50 && parsedAmount <= availableBalance;
  const isDestinationValid = destination.trim().length > 3;

  const handleSubmit = async () => {
    if (!isAmountValid || !isDestinationValid) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    onRequest(parsedAmount, method, destination);
    setIsSubmitting(false);
    onOpenChange(false);

    // Reset form after closing
    setTimeout(() => {
      setAmount("");
      setDestination("");
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {t("pages.payouts.dialog.title")}
          </DialogTitle>
          <DialogDescription>{t("pages.payouts.dialog.description")}</DialogDescription>
        </DialogHeader>

        <div className="py-2 flex flex-col gap-6">
          {/* Amount field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="amount" className="font-semibold text-sm">
                {t("pages.payouts.dialog.amount_label")}
              </Label>
              <span className="text-xs text-muted-foreground font-medium">
                {t("pages.payouts.dialog.available_label")}: $
                {availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                $
              </span>
              <Input
                id="amount"
                type="number"
                className="pl-7 font-semibold text-lg"
                value={amount}
                onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                min={50}
                max={availableBalance}
                placeholder="0.00"
              />
            </div>
            {parsedAmount > 0 && parsedAmount < 50 && (
              <p className="text-xs text-destructive mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle size={12} /> {t("pages.payouts.dialog.min_payout_error")}
              </p>
            )}
            {parsedAmount > availableBalance && (
              <p className="text-xs text-destructive mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle size={12} /> {t("pages.payouts.dialog.balance_exceeded_error")}
              </p>
            )}
            {typeof amount === "number" && amount > 0 && isAmountValid && (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 mt-1.5 text-xs text-primary font-semibold"
                onClick={() => setAmount(availableBalance)}
              >
                {t("pages.payouts.dialog.withdraw_max")} (${availableBalance.toLocaleString()})
              </Button>
            )}
          </div>

          {/* Method Selection */}
          <div>
            <Label className="font-semibold text-sm mb-2 block">
              {t("pages.payouts.dialog.method_label")}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  method === "paypal"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:bg-muted/30"
                }`}
              >
                <input
                  type="radio"
                  name="payout-method"
                  value="paypal"
                  checked={method === "paypal"}
                  onChange={() => setMethod("paypal")}
                  className="sr-only"
                />
                <Mail size={20} className={method === "paypal" ? "text-primary" : ""} />
                <span className="text-xs font-bold text-current">
                  {t("pages.payouts.method.paypal")}
                </span>
              </label>

              <label
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  method === "bank_transfer"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:bg-muted/30"
                }`}
              >
                <input
                  type="radio"
                  name="payout-method"
                  value="bank_transfer"
                  checked={method === "bank_transfer"}
                  onChange={() => setMethod("bank_transfer")}
                  className="sr-only"
                />
                <Building size={20} className={method === "bank_transfer" ? "text-primary" : ""} />
                <span className="text-xs font-bold text-current">
                  {t("pages.payouts.method.bank_transfer")}
                </span>
              </label>
            </div>
          </div>

          {/* Destination */}
          <div>
            <Label htmlFor="destination" className="font-semibold text-sm mb-2 block">
              {method === "paypal"
                ? t("pages.payouts.dialog.paypal_email")
                : t("pages.payouts.dialog.bank_account")}
            </Label>
            <Input
              id="destination"
              type={method === "paypal" ? "email" : "text"}
              placeholder={
                method === "paypal"
                  ? t("pages.payouts.dialog.email_placeholder")
                  : t("pages.payouts.dialog.account_placeholder")
              }
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            {t("pages.payouts.dialog.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isAmountValid || !isDestinationValid || isSubmitting}
            className="gap-2 font-bold min-w-[120px]"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              t("pages.payouts.dialog.submit")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
