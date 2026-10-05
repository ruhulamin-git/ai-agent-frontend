"use client";

import { useTranslation } from "react-i18next";

import { ConfirmDialog, FormDialog } from "@/shared/components";
import { CustomTextField } from "@/shared/form-elements";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Skeleton } from "@/shared/ui/skeleton";

import { useApiKeyManagement } from "../hooks";

interface ApiKeyManagementProps {
  agentId: string;
}

export const ApiKeyManagement = ({ agentId }: ApiKeyManagementProps) => {
  const { t } = useTranslation();
  const {
    apiKeys,
    isLoadingKeys,
    newKeyName,
    setNewKeyName,
    showCreateForm,
    setShowCreateForm,
    handleCreateKey,
    openRevokeConfirm,
    closeRevokeConfirm,
    confirmRevoke,
    showRevokeConfirm,
    isCreating,
    isRevoking,
    newlyCreatedKey,
    setNewlyCreatedKey,
    handleCopyKey,
  } = useApiKeyManagement({ agentId });

  return (
    <section>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-muted-foreground">vpn_key</span>
          <h3 className="text-sm font-medium text-foreground">
            {t("pages.my_agents.agent_settings.api_keys.title")}
          </h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCreateForm(true)}
          className="h-7 px-2.5 text-[11px] rounded-md gap-1"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          {t("pages.my_agents.agent_settings.api_keys.new_key")}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mb-5">
        {t("pages.my_agents.agent_settings.api_keys.description")}
      </p>

      {/* Create Key Dialog */}
      <FormDialog
        open={showCreateForm}
        onOpenChange={(open) => {
          setShowCreateForm(open);
          if (!open) setNewKeyName("");
        }}
        title={t("pages.my_agents.agent_settings.api_keys.create_title")}
        description={t("pages.my_agents.agent_settings.api_keys.create_description")}
        submitLabel={t("pages.my_agents.agent_settings.api_keys.create")}
        submitLoadingLabel={t("pages.my_agents.agent_settings.api_keys.creating")}
        onSubmit={handleCreateKey}
        isSubmitting={isCreating}
        className="sm:max-w-md"
      >
        <div>
          <Label
            htmlFor="api-key-name"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            {t("pages.my_agents.agent_settings.api_keys.key_name")}
          </Label>
          <CustomTextField
            id="api-key-name"
            placeholder={t("pages.my_agents.agent_settings.api_keys.key_name_placeholder")}
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateKey();
            }}
          />
        </div>
      </FormDialog>

      {/* API Keys List */}
      {isLoadingKeys ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-7 w-16 rounded-md" />
            </div>
          ))}
        </div>
      ) : apiKeys.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-border rounded-xl">
          <span className="material-symbols-outlined text-2xl text-muted-foreground/40 mb-2 block">
            key_off
          </span>
          <p className="text-sm text-muted-foreground">
            {t("pages.my_agents.agent_settings.api_keys.no_keys")}
          </p>
          <p className="text-xs text-muted-foreground/60 mt-0.5">
            {t("pages.my_agents.agent_settings.api_keys.no_keys_description")}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-muted">
                  <span className="material-symbols-outlined text-base text-muted-foreground">
                    key
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">{key.name}</span>
                    <Badge
                      variant={key.revoked ? "secondary" : "default"}
                      className="text-[10px] px-1.5 py-0 h-4 leading-4 shrink-0"
                    >
                      {key.revoked
                        ? t("pages.my_agents.agent_settings.api_keys.revoked")
                        : t("pages.my_agents.agent_settings.active")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <code className="text-[11px] text-muted-foreground font-mono">
                      {key.keyPrefix}…
                    </code>
                    <span className="text-[11px] text-muted-foreground/60">
                      {new Date(key.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {!key.revoked && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 text-[11px] h-7 px-2 rounded-md shrink-0 ml-2"
                  onClick={() => openRevokeConfirm(key.id)}
                  disabled={isRevoking}
                >
                  {t("pages.my_agents.agent_settings.api_keys.revoke")}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Revoke Key Confirmation */}
      <ConfirmDialog
        open={showRevokeConfirm}
        onOpenChange={(open) => {
          if (!open) closeRevokeConfirm();
        }}
        title={t("pages.my_agents.agent_settings.api_keys.revoke_title")}
        description={t("pages.my_agents.agent_settings.api_keys.revoke_description")}
        confirmLabel={t("pages.my_agents.agent_settings.api_keys.revoke")}
        confirmLoadingLabel={t("pages.my_agents.agent_settings.api_keys.revoking")}
        onConfirm={confirmRevoke}
        isConfirming={isRevoking}
        variant="destructive"
        className="sm:max-w-md"
      />

      {/* Newly Created Key Display */}
      <FormDialog
        open={!!newlyCreatedKey}
        onOpenChange={(open) => {
          if (!open) setNewlyCreatedKey(null);
        }}
        title={t("pages.my_agents.agent_settings.api_keys.created_title")}
        description={t("pages.my_agents.agent_settings.api_keys.created_description")}
        submitLabel={t("pages.my_agents.agent_settings.api_keys.done")}
        onSubmit={() => setNewlyCreatedKey(null)}
        className="sm:max-w-md"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-muted border border-border">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                {t("pages.my_agents.agent_settings.api_keys.your_api_key")}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[10px] gap-1"
                onClick={() => handleCopyKey(newlyCreatedKey || "")}
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                {t("pages.my_agents.agent_settings.api_keys.copy")}
              </Button>
            </div>
            <code className="text-xs font-mono break-all text-primary block bg-background/50 p-2 rounded border border-border/50">
              {newlyCreatedKey}
            </code>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/5 text-destructive border border-destructive/10">
            <span className="material-symbols-outlined text-sm mt-0.5">warning</span>
            <p className="text-[11px] leading-relaxed">
              {t("pages.my_agents.agent_settings.api_keys.warning")}
            </p>
          </div>
        </div>
      </FormDialog>
    </section>
  );
};
