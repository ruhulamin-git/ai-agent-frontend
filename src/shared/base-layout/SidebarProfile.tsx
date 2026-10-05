"use client";

import { IconChevronUp, IconLogout, IconMoon, IconSettings, IconSun } from "@tabler/icons-react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/shared/ui/sidebar";
import { Skeleton } from "@/shared/ui/skeleton";
import { useLogout } from "@/utils/auth";
import { clearStorage } from "@/utils/clearStorage";
import { REFRESH_TOKEN } from "@/utils/constants";
import { changeLanguage } from "@/utils/i18n";

import type { UserProfile } from "@/shared/types";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "bn", name: "বাংলা", flag: "🇧🇩" },
];

interface SidebarProfileProps {
  user?: UserProfile | null;
  isLoading?: boolean;
}

export const SidebarProfile = ({ user, isLoading }: SidebarProfileProps) => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { isMobile, state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const token = getCookie(REFRESH_TOKEN);
  const { mutateAsync, isPending } = useLogout();
  const [isDisabled, setIsDisabled] = useState(false);

  const handleLanguageChange = async (langCode: string) => {
    await changeLanguage(langCode);
    localStorage.setItem("language", langCode);
  };

  const handleLogout = async () => {
    if (isDisabled || isPending) return;

    setIsDisabled(true);
    try {
      await mutateAsync(token);
      clearStorage();
      toast.success("See you soon! Sign Out successful.");
      window.location.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsDisabled(false);
    }
  };

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="h-14 rounded-xl cursor-default">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            {!isCollapsed && (
              <div className="flex flex-col gap-1.5 flex-1 overflow-hidden ml-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!user) return null;

  const name = `${user.firstName} ${user.lastName}`;
  const initials = user.firstName?.[0] || "U";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`
                h-14 rounded-xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-white/5 group cursor-pointer
                ${isCollapsed ? "justify-center px-0" : ""}
              `}
            >
              <Avatar className="h-9 w-9 shrink-0 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm transition-transform group-hover:scale-105">
                <AvatarImage
                  src={user.profilePictureUrl || user.profile?.profilePictureUrl || undefined}
                  alt={name}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-full bg-primary/10 text-primary font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                    <span className="truncate font-bold text-slate-900 dark:text-white">
                      {name}
                    </span>
                    <span className="truncate text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {user.email}
                    </span>
                  </div>
                  <IconChevronUp className="ml-auto size-4 text-slate-400 group-hover:text-primary transition-colors" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-9 w-9 rounded-full">
                  <AvatarImage
                    src={user.profilePictureUrl || user.profile?.profilePictureUrl || undefined}
                    alt={name}
                  />
                  <AvatarFallback className="rounded-full bg-primary/10 text-primary font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/account-settings")}
                className="cursor-pointer"
              >
                <IconSettings className="mr-2 h-4 w-4" />
                <span>{t("profile.account_settings")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/subscription")}
                className="cursor-pointer"
              >
                <IconSettings className="mr-2 h-4 w-4" />
                <span>Subscription & Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="cursor-pointer"
              >
                {theme === "dark" ? (
                  <IconSun className="mr-2 h-4 w-4" />
                ) : (
                  <IconMoon className="mr-2 h-4 w-4" />
                )}
                <span>
                  {theme === "dark"
                    ? t("theme_settings.light_mode")
                    : t("theme_settings.dark_mode")}
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-2 py-1.5">
              {t("fields.language")}
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-base">{lang.flag}</span>
                  <span className="flex-1">{lang.name}</span>
                  {lang.code === i18n.language && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isDisabled || isPending}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <IconLogout className="mr-2 h-4 w-4" />
              <span>{t("auth.logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
