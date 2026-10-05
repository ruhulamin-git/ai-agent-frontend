"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/shared/ui/button";
import { SidebarTrigger } from "@/shared/ui/sidebar";

import { LanguageSwitcher } from "./LanguageSwitcher";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-30 border-b border-border bg-background backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="flex h-16 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1 text-foreground hover:bg-accent hover:text-accent-foreground" />
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            {/* Render nothing or skeleton for theme toggle to avoid mismatch */}
            <div className="w-9 h-9" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex h-16 items-center gap-2 px-4">
        {/* Sidebar Toggle */}
        <SidebarTrigger className="-ml-1 text-foreground hover:bg-accent hover:text-accent-foreground" />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right Side Actions */}
        <div className="flex items-center gap-1">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:bg-accent hover:text-foreground"
            title="Toggle theme"
          >
            {theme === "dark" ? <IconSun size={20} /> : <IconMoon size={20} />}
          </Button>
        </div>
      </div>
    </header>
  );
};
