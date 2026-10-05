"use client";

import React, { useEffect, useState } from "react";
import { AlignLeft } from "lucide-react";
import { TableOfContentsItem } from "../types";

interface DocsTOCProps {
  toc: TableOfContentsItem[];
}

export const DocsTOC: React.FC<DocsTOCProps> = ({ toc }) => {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0px 0px -60% 0px",
        threshold: 0.1,
      }
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 uppercase tracking-wider">
        <AlignLeft className="w-3.5 h-3.5 text-teal-400" />
        <span>On this page</span>
      </div>

      <nav className="space-y-1 text-xs">
        {toc.map((item) => {
          const isActive = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block py-1 transition-colors border-l-2 ${
                item.level === 3 ? "pl-5" : "pl-3"
              } ${
                isActive
                  ? "border-teal-400 text-teal-300 font-medium"
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700"
              }`}
            >
              {item.title}
            </a>
          );
        })}
      </nav>
    </div>
  );
};
