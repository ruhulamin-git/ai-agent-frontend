"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { Check, Copy, ChevronRight, Clock, Calendar } from "lucide-react";
import { DocItem } from "../types";

interface DocsContentProps {
  doc: DocItem;
}

const CodeBlock = ({ language, code }: { language: string; code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="my-5 rounded-xl overflow-hidden border border-gray-800 bg-[#0d1117] shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800/80 bg-gray-900/60 text-xs">
        <span className="font-mono text-gray-400 lowercase">{language || "text"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-800/60 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-[11px]">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-xs sm:text-[13px] font-mono leading-relaxed text-gray-200 scrollbar-thin scrollbar-thumb-gray-800">
        <pre>{code}</pre>
      </div>
    </div>
  );
};

export const DocsContent: React.FC<DocsContentProps> = ({ doc }) => {
  return (
    <article className="max-w-4xl w-full mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 flex-wrap">
        <Link href="/docs" className="hover:text-teal-400 transition-colors">
          Docs
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-600" />
        <span className="text-gray-400">{doc.category}</span>
        <ChevronRight className="w-3 h-3 text-gray-600" />
        <span className="text-teal-300 font-medium truncate">{doc.title}</span>
      </nav>

      {/* Meta info header */}
      <div className="flex items-center gap-4 text-xs text-gray-400 mb-6 pb-4 border-b border-gray-800/80 flex-wrap">
        {doc.readingTime && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>{doc.readingTime}</span>
          </div>
        )}
        {doc.lastUpdated && (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Updated {doc.lastUpdated}</span>
          </div>
        )}
      </div>

      {/* Markdown Body */}
      <div className="text-gray-300 leading-relaxed space-y-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => {
              return (
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4 pb-2 border-b border-gray-800">
                  {children}
                </h1>
              );
            },
            h2: ({ children }) => {
              const text = String(children);
              const id = text
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-");
              return (
                <h2
                  id={id}
                  className="group flex items-center text-lg sm:text-xl font-semibold text-white mt-8 mb-3 pt-4 border-t border-gray-800/60 scroll-mt-20"
                >
                  <a href={`#${id}`} className="hover:text-teal-400 transition-colors">
                    {children}
                  </a>
                </h2>
              );
            },
            h3: ({ children }) => {
              const text = String(children);
              const id = text
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-");
              return (
                <h3
                  id={id}
                  className="text-base sm:text-lg font-medium text-gray-100 mt-6 mb-2 scroll-mt-20"
                >
                  <a href={`#${id}`} className="hover:text-teal-400 transition-colors">
                    {children}
                  </a>
                </h3>
              );
            },
            p: ({ children }) => (
              <p className="text-sm sm:text-[15px] leading-7 text-gray-300 my-3">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-5 space-y-2 my-3 text-sm sm:text-[15px] text-gray-300">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5 space-y-2 my-3 text-sm sm:text-[15px] text-gray-300">
                {children}
              </ol>
            ),
            li: ({ children }) => <li className="leading-7">{children}</li>,
            strong: ({ children }) => (
              <strong className="font-semibold text-white">{children}</strong>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-teal-400 hover:text-teal-300 underline underline-offset-4 decoration-teal-500/40 hover:decoration-teal-400 transition-colors"
                {...(href?.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                {children}
              </a>
            ),
            blockquote: ({ children }) => {
              return (
                <blockquote className="my-4 p-4 rounded-xl border-l-4 border-teal-500 bg-teal-500/5 text-gray-300 text-xs sm:text-sm leading-relaxed">
                  {children}
                </blockquote>
              );
            },
            code: ({ className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              const isBlock = match || String(children).includes("\n");
              if (isBlock) {
                return (
                  <CodeBlock
                    language={match ? match[1] : ""}
                    code={String(children).replace(/\n$/, "")}
                  />
                );
              }
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-gray-900 border border-gray-800 font-mono text-xs sm:text-[13px] text-teal-300"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            table: ({ children }) => (
              <div className="my-5 overflow-x-auto rounded-xl border border-gray-800">
                <table className="w-full text-left text-xs sm:text-sm text-gray-300 divide-y divide-gray-800">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-gray-900/80 text-white font-semibold">{children}</thead>
            ),
            tbody: ({ children }) => (
              <tbody className="divide-y divide-gray-800/60 bg-[#070b14]">{children}</tbody>
            ),
            tr: ({ children }) => <tr className="hover:bg-gray-900/30 transition-colors">{children}</tr>,
            th: ({ children }) => <th className="px-4 py-2.5 font-medium text-gray-200">{children}</th>,
            td: ({ children }) => <td className="px-4 py-2.5">{children}</td>,
            hr: () => <hr className="my-6 border-gray-800" />,
          }}
        >
          {doc.content}
        </ReactMarkdown>
      </div>
    </article>
  );
};
