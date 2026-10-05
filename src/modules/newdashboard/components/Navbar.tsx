"use client";

import { IconCreditCard, IconLink, IconLogout, IconSettings } from "@tabler/icons-react";
import { getCookie } from "cookies-next";
import { useQueryClient } from "@tanstack/react-query";
import { Moon, ShoppingBagIcon, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { useCurrentSubscription } from "@/modules/pricing/subscription-dashboard/service";
import { useUserProfile } from "@/shared/api/userProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useLogout } from "@/utils/auth";
import { clearStorage } from "@/utils/clearStorage";
import { REFRESH_TOKEN } from "@/utils/constants";

import { useTheme } from "../context/ThemeContext";

interface NavbarProps {
  title?: string;
  subtitle?: string;
  onMenuClick?: () => void;
  isSidebarCollapsed?: boolean;
}

const ProfileDropdown = () => {
  const [mounted, setMounted] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = getCookie(REFRESH_TOKEN);
  const { mutateAsync, isPending } = useLogout();
  const { data: user } = useUserProfile();
  const { data: subscription } = useCurrentSubscription({
    config: {
      retry: 2,
      staleTime: 0, // Always fetch fresh data
      gcTime: 0, // Don't cache
      refetchOnMount: "always", // Always refetch on mount
      refetchOnWindowFocus: true, // Refetch on window focus
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-7 h-7 lg:w-8 lg:h-8" />; // Return placeholder of same size to prevent layout shift
  }

  // Check if user has active subscription
  const hasActiveSubscription = subscription?.isActive && !subscription?.isExpired && subscription?.status?.status === "active";

  const handleLogout = async () => {
    if (isDisabled || isPending) return;

    setIsDisabled(true);
    try {
      await mutateAsync(token);
      clearStorage();

      // Completely remove all cached queries to clear old user data
      queryClient.removeQueries({ queryKey: ["user-profile"] });
      queryClient.removeQueries({ queryKey: ["current-subscription"] });
      queryClient.removeQueries({ queryKey: ["plans"] });

      toast.success("Sign Out successful. See you soon!");
      window.dispatchEvent(new Event("auth-change"));
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsDisabled(false);
    }
  };
  const name = `${user?.firstName} ${user?.lastName}`;
  const initials = user?.firstName?.[0] || user?.username?.[0] || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 lg:gap-3 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg p-1 transition-colors cursor-pointer">
          <Avatar className="w-7 h-7 lg:w-8 lg:h-8">
            <AvatarImage
              src={user?.profilePictureUrl || user?.profile?.profilePictureUrl || undefined}
              alt={name}
            />
            <AvatarFallback className=" text-xs font-bold">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 md:w-60">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-1">
            <Avatar className="h-10 w-10 font-semibold text-primary">
              <AvatarImage
                src={user?.profilePictureUrl || user?.profile?.profilePictureUrl || undefined}
                alt={name}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/marketplace" className="w-full cursor-pointer">
              <ShoppingBagIcon className="mr-2 h-4 w-4" />
              <span>Marketplace</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account-settings" className="w-full cursor-pointer">
              <IconSettings className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </Link>
          </DropdownMenuItem>
          {hasActiveSubscription && (
            <DropdownMenuItem asChild>
              <Link href="/developer-dashboard/billing" className="w-full cursor-pointer">
                <IconCreditCard className="mr-2 h-4 w-4" />
                <span>Subscription & Billing</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isDisabled || isPending}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <IconLogout className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Navbar = ({
  title,
  subtitle,
  onMenuClick,
  isSidebarCollapsed = false,
}: NavbarProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`fixed top-0 right-0 left-0 bg-white/80 dark:bg-gray-900 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-4 lg:px-5 z-40 transition-all duration-300 h-15 flex items-center ${isSidebarCollapsed ? "lg:left-16" : "lg:left-64"
        }`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button onClick={onMenuClick} className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg lg:text-xl font-md text-gray-900 dark:text-white">{title}</h1>
          {subtitle && <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-400">{subtitle}</span>}
        </div>
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
};
