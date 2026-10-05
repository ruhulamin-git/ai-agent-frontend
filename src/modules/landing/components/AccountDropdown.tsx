"use client";

import {
  IconCreditCard,
  IconDashboard,
  IconLink,
  IconLogout,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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

export const AccountDropdown = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();
  const token = getCookie(REFRESH_TOKEN);
  const { mutateAsync, isPending } = useLogout();
  const { data: user } = useUserProfile();

  const handleLogout = async () => {
    if (isDisabled || isPending) return;

    setIsDisabled(true);
    try {
      await mutateAsync(token);
      clearStorage();
      toast.success("Sign Out successful. See you soon!");
      // Dispatch event to notify Header to update authentication state
      window.dispatchEvent(new Event("auth-change"));
      window.location.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsDisabled(false);
    }
  };

  if (!user) {
    return (
      <Button
        variant="ghost"
        className="hidden md:flex text-slate-300 hover:text-white font-medium text-sm transition-all rounded-md hover:bg-white/5 px-4 py-2 h-auto"
      >
        <IconUser size={16} />
        My Account
      </Button>
    );
  }

  const name = `${user.firstName} ${user.lastName}`;
  const initials = user.firstName?.[0] || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hidden md:flex text-slate-300 hover:text-white font-medium text-sm transition-all rounded-md hover:bg-white/5 px-4 py-2 h-auto"
        >
          <IconUser size={16} />
          My Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 md:w-60 lg:w-70">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 font-semibold text-primary">
              <AvatarImage
                src={user.profilePictureUrl || user.profile?.profilePictureUrl || undefined}
                alt={name}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/user-dashboard" className="w-full cursor-pointer">
              <IconDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account-settings" className="w-full cursor-pointer">
              <IconSettings className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </Link>
          </DropdownMenuItem>
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
