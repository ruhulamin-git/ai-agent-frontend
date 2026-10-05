"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/shared/ui/button";

import { useEmbedCode } from "../services";

import type { ApiKey } from "../types";

const COPY_FEEDBACK_TIMEOUT_MS = 2000;
const INDENT_REM = 1.5;

type TokenKind = "comment" | "tag" | "attr" | "value" | "text";

interface CodeToken {
  text: string;
  kind: TokenKind;
}

interface CodeLine {
  key: string;
  indent: number;
  parts: CodeToken[];
}

/** Break the raw embed string into pretty-printed, coloured JSX lines. */
const formatEmbedCode = (raw: string): CodeLine[] => {
  const flat = raw.replace(/\s+/g, " ").trim();

  const lines: CodeLine[] = [];

  // <!-- comment -->
  const commentMatch = flat.match(/<!--[\s\S]*?-->/);
  if (commentMatch) {
    lines.push({ key: "comment", indent: 0, parts: [{ text: commentMatch[0], kind: "comment" }] });
  }

  // <script ...attrs... async></script>
  const scriptMatch = flat.match(/<script([\s\S]*?)>([\s\S]*?)<\/script>/i);
  if (scriptMatch) {
    const attrsRaw = scriptMatch[1].trim();
    const attrs = attrsRaw.match(/[\w-]+(?:="[^"]*")?/g) || [];

    // Opening tag
    lines.push({ key: "script-open", indent: 0, parts: [{ text: "<script", kind: "tag" }] });

    // Each attribute on its own line
    attrs.forEach((attr) => {
      const eqIdx = attr.indexOf("=");
      if (eqIdx === -1) {
        // boolean attr like "async"
        lines.push({ key: `attr-${attr}`, indent: 1, parts: [{ text: attr, kind: "attr" }] });
      } else {
        const name = attr.slice(0, eqIdx);
        const val = attr.slice(eqIdx + 1);
        lines.push({
          key: `attr-${name}`,
          indent: 1,
          parts: [
            { text: name, kind: "attr" },
            { text: "=", kind: "text" },
            { text: val, kind: "value" },
          ],
        });
      }
    });

    lines.push({ key: "script-close-tag", indent: 0, parts: [{ text: ">", kind: "tag" }] });
    lines.push({ key: "script-end", indent: 0, parts: [{ text: "</script>", kind: "tag" }] });
  }

  return lines;
};

const kindToClass: Record<string, string> = {
  comment: "text-slate-500",
  tag: "text-sky-400",
  attr: "text-violet-400",
  value: "text-emerald-400",
  text: "text-slate-400",
};

interface EmbedCodeSectionProps {
  agentId: string;
  apiKeys: ApiKey[];
}

export const EmbedCodeSection = ({ agentId, apiKeys }: EmbedCodeSectionProps) => {
  const { t } = useTranslation();
  const { data: embedData } = useEmbedCode({ agentId });
  const [copied, setCopied] = useState(false);

  const activeKey = apiKeys.find((k) => !k.revoked);

  const rawEmbed = useMemo(() => {
    if (!embedData?.embedCode) return "";
    const apiKeyValue = activeKey ? `${activeKey.keyPrefix}…` : "YOUR_API_KEY";
    return embedData.embedCode.replace(/data-api-key="[^"]*"/, `data-api-key="${apiKeyValue}"`);
  }, [embedData?.embedCode, activeKey]);

  const formattedLines = useMemo(() => formatEmbedCode(rawEmbed), [rawEmbed]);

  const handleCopyCode = async () => {
    if (!rawEmbed) return;
    try {
      await navigator.clipboard.writeText(rawEmbed);
      setCopied(true);
      toast.success(t("pages.my_agents.agent_settings.api_keys.copied"));
      setTimeout(() => setCopied(false), COPY_FEEDBACK_TIMEOUT_MS);
    } catch {
      toast.error(t("pages.my_agents.agent_settings.api_keys.copy_failed"));
    }
  };

  if (!embedData) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-base text-muted-foreground">code</span>
        <h3 className="text-sm font-medium text-foreground">
          {t("pages.my_agents.agent_settings.embed_code.title")}
        </h3>
      </div>
      <p className="text-xs text-muted-foreground mb-5">
        {t("pages.my_agents.agent_settings.embed_code.description")}{" "}
        <code className="text-[11px] font-mono bg-muted px-1 py-0.5 rounded">&lt;/body&gt;</code>{" "}
        {t("pages.my_agents.agent_settings.embed_code.description_tag")}
      </p>

      {/* Code block */}
      <div className="relative rounded-xl border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
            <span className="ml-3 text-[11px] text-slate-500 font-mono">
              {t("pages.my_agents.agent_settings.embed_code.html")}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md gap-1"
            onClick={handleCopyCode}
          >
            <span className="material-symbols-outlined text-sm">
              {copied ? "check" : "content_copy"}
            </span>
            {copied
              ? t("pages.my_agents.agent_settings.embed_code.copied")
              : t("pages.my_agents.agent_settings.embed_code.copy")}
          </Button>
        </div>

        {/* Code body */}
        <div className="bg-slate-950 px-4 py-4 overflow-x-auto">
          <code className="text-[13px] leading-6 font-mono block">
            {formattedLines.map((line) => (
              <div key={line.key} style={{ paddingLeft: `${line.indent * INDENT_REM}rem` }}>
                {line.parts.map((part) => (
                  <span key={`${line.key}-${part.kind}`} className={kindToClass[part.kind]}>
                    {part.text}
                  </span>
                ))}
              </div>
            ))}
          </code>
        </div>
      </div>

      {embedData.instructions && (
        <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
          {embedData.instructions}
        </p>
      )}
    </section>
  );
};
