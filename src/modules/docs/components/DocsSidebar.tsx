"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Rocket,
  Layers,
  Globe,
  GraduationCap,
  HelpCircle,
  ShoppingBag,
  Search,
  ChevronDown,
  ChevronRight,
  BookOpen,
  ArrowUpRight,
  Users,
  ShieldCheck,
} from "lucide-react";
import { DOCS_CATEGORIES } from "../data/docsData";

interface DocsSidebarProps {
  onItemClick?: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Rocket: <Rocket className="w-4 h-4 text-teal-400" />,
  Layers: <Layers className="w-4 h-4 text-indigo-400" />,
  Globe: <Globe className="w-4 h-4 text-emerald-400" />,
  ShoppingBag: <ShoppingBag className="w-4 h-4 text-amber-400" />,
  GraduationCap: <GraduationCap className="w-4 h-4 text-purple-400" />,
  HelpCircle: <HelpCircle className="w-4 h-4 text-sky-400" />,
  Users: <Users className="w-4 h-4 text-teal-400" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
};

export const DocsSidebar: React.FC<DocsSidebarProps> = ({ onItemClick }) => {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    "getting-started": true,
    "normal-user": true,
    developer: true,
  });

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Filter items based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return DOCS_CATEGORIES;

    const query = searchQuery.toLowerCase();
    return DOCS_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [searchQuery]);

  return (
    <aside className="w-full h-full flex flex-col bg-gray-950/60 backdrop-blur-xl border-r border-gray-800/80">
      {/* Search */}
      <div className="p-3.5 border-b border-gray-800/80 sticky top-0 bg-gray-950/95 z-10">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-gray-900/90 border border-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/40 transition-all"
          />
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-800">
        {filteredCategories.map((category) => {
          const isOpen = searchQuery.trim() ? true : openCategories[category.id] !== false;

          return (
            <div key={category.id} className="space-y-1">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-gray-300 hover:text-white rounded-md hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {CATEGORY_ICONS[category.icon] || <BookOpen className="w-4 h-4 text-gray-400" />}
                  <span>{category.title}</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                )}
              </button>

              {isOpen && (
                <div className="pl-6 space-y-1 border-l border-gray-800/60 ml-4 mt-1">
                  {category.items.map((item) => {
                    const href = `/docs/${item.slug}`;
                    const isActive = pathname === href;

                    return (
                      <Link
                        key={item.id}
                        href={href}
                        onClick={onItemClick}
                        className={`group flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md transition-all ${isActive
                            ? "bg-teal-500/15 text-teal-300 font-medium border-l-2 border-teal-400 -ml-[1px]"
                            : "text-gray-400 hover:text-gray-200 hover:bg-gray-900/40"
                          }`}
                      >
                        <span className="truncate">{item.title}</span>
                        {item.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${item.badge === "Popular"
                                ? "bg-amber-500/15 text-amber-300 border border-amber-500/20"
                                : "bg-teal-500/15 text-teal-300 border border-teal-500/20"
                              }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filteredCategories.length === 0 && (
          <div className="text-center py-8 text-xs text-gray-500">
            No guides found matching &quot;{searchQuery}&quot;
          </div>
        )}
      </nav>

      {/* Footer Quick Links */}
      <div className="p-3 border-t border-gray-800/80 bg-gray-950/80 space-y-1">
        <Link
          href="/start-building"
          className="flex items-center justify-between px-2.5 py-1.5 text-xs text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 rounded-md transition-colors"
        >
          <span>Open AI Builder</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
};
