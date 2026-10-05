"use client";

import {
  Building,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  CreditCard,
  Download,
  Mail,
  WalletCards,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";

import { MOCK_PAYOUT_HISTORY, MOCK_PAYOUT_METRICS } from "./mock-data";
import { RequestPayoutDialog } from "./RequestPayoutDialog";

import type { PayoutRecord } from "./mock-data";

export const PayoutsPage = () => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [history, setHistory] = useState<PayoutRecord[]>(MOCK_PAYOUT_HISTORY);
  const [metrics, setMetrics] = useState(MOCK_PAYOUT_METRICS);

  const handleRequestPayout = (
    amount: number,
    method: "paypal" | "bank_transfer",
    destination: string
  ) => {
    // Optimistic UI update for mock data
    const newPayout: PayoutRecord = {
      id: `po_${Math.random().toString(36).substring(7)}`,
      date: new Date().toISOString(),
      amount,
      status: "pending",
      method,
      destination,
    };

    setHistory([newPayout, ...history]);
    setMetrics((prev) => ({
      ...prev,
      availableBalance: prev.availableBalance - amount,
      pendingPayouts: prev.pendingPayouts + amount,
    }));
  };

  const getStatusConfig = (status: PayoutRecord["status"]) => {
    switch (status) {
      case "completed":
        return {
          icon: <CheckCircle2 size={14} />,
          color: "text-green-600",
          bg: "bg-green-600/10",
          label: t("pages.payouts.status.completed"),
        };
      case "pending":
        return {
          icon: <Clock size={14} />,
          color: "text-amber-600",
          bg: "bg-amber-600/10",
          label: t("pages.payouts.status.pending"),
        };
      case "rejected":
        return {
          icon: <XCircle size={14} />,
          color: "text-destructive",
          bg: "bg-destructive/10",
          label: t("pages.payouts.status.rejected"),
        };
    }
  };

  const getMethodIcon = (method: PayoutRecord["method"]) => {
    switch (method) {
      case "paypal":
        return <Mail size={16} className="text-muted-foreground mr-2" />;
      case "bank_transfer":
        return <Building size={16} className="text-muted-foreground mr-2" />;
    }
  };

  return (
    <div>
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-slate-200/60 dark:border-slate-800/60 mb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold uppercase tracking-widest text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            {t("pages.payouts.subtitle")}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-3">
            <WalletCards className="text-primary h-8 w-8" />
            {t("pages.payouts.title")}
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
            {t("pages.payouts.description")}
          </p>
        </div>
        <Button
          size="lg"
          className="gap-2 font-bold px-6 shadow-md hover:shadow-lg transition-all h-12"
          onClick={() => setDialogOpen(true)}
          disabled={metrics.availableBalance <= 0}
        >
          <CircleDollarSign size={18} />
          {t("pages.payouts.request_payout")}
        </Button>
      </header>

      {/* ─── Metrics Overview ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Available Balance */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <CircleDollarSign size={80} />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            {t("pages.payouts.available_balance")}
          </p>
          <div className="text-4xl font-black text-foreground mb-1">
            $
            {metrics.availableBalance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            {t("pages.payouts.ready_to_withdraw")}
          </p>
        </div>

        {/* Pending Payouts */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            {t("pages.payouts.pending")}
          </p>
          <div className="text-3xl font-bold text-foreground mb-1">
            $
            {metrics.pendingPayouts.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <p className="text-sm text-amber-600 font-medium flex items-center gap-1.5">
            <Clock size={14} /> {t("pages.payouts.processing_now")}
          </p>
        </div>

        {/* Lifetime Earnings */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            {t("pages.payouts.lifetime_earnings")}
          </p>
          <div className="text-3xl font-bold text-foreground mb-1">
            $
            {metrics.lifetimeEarnings.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
            <CreditCard size={14} /> {t("pages.payouts.total_accumulated")}
          </p>
        </div>
      </div>

      {/* ─── Payout History ─── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">{t("pages.payouts.history.title")}</h2>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 font-medium"
            disabled={history.length === 0}
          >
            <Download size={14} />
            {t("pages.payouts.history.export_csv")}
          </Button>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border-2 border-dashed border-border bg-muted/10">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <Clock size={32} />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              {t("pages.payouts.history.no_history")}
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto text-sm">
              {t("pages.payouts.history.no_history_description")}
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[1fr_1.5fr_1fr_1fr_auto] gap-4 px-6 py-4 bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
              <span>{t("pages.payouts.history.date")}</span>
              <span>{t("pages.payouts.history.destination")}</span>
              <span>{t("pages.payouts.history.method")}</span>
              <span>{t("pages.payouts.history.status")}</span>
              <span className="text-right">{t("pages.payouts.history.amount")}</span>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-border">
              {history.map((record) => {
                const status = getStatusConfig(record.status);
                const dateObj = new Date(record.date);

                return (
                  <div
                    key={record.id}
                    className="group grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr_1fr_auto] gap-3 md:gap-4 px-6 py-4 hover:bg-muted/20 transition-colors items-center"
                  >
                    {/* Date */}
                    <div>
                      <span className="md:hidden text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        {t("pages.payouts.history.date")}
                      </span>
                      <p className="font-semibold text-sm text-foreground">
                        {dateObj.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {dateObj.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {/* Destination */}
                    <div>
                      <span className="md:hidden text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        {t("pages.payouts.history.destination")}
                      </span>
                      <p
                        className="text-sm font-medium text-foreground truncate"
                        title={record.destination}
                      >
                        {record.destination}
                      </p>
                    </div>

                    {/* Method */}
                    <div className="flex items-center">
                      <span className="md:hidden text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground block mb-1 mr-2">
                        {t("pages.payouts.history.method")}:
                      </span>
                      {getMethodIcon(record.method)}
                      <span className="text-sm capitalize text-muted-foreground">
                        {t(`payouts.method.${record.method}`)}
                      </span>
                    </div>

                    {/* Status */}
                    <div>
                      <span className="md:hidden text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        {t("pages.payouts.history.status")}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          status!.bg
                        } ${status!.color}`}
                      >
                        {status!.icon}
                        {status!.label}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="md:text-right flex items-center justify-between md:block">
                      <span className="md:hidden text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground">
                        {t("pages.payouts.history.amount")}
                      </span>
                      <span className="text-base font-bold text-foreground tracking-tight">
                        $
                        {record.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <RequestPayoutDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        availableBalance={metrics.availableBalance}
        onRequest={handleRequestPayout}
      />
    </div>
  );
};
