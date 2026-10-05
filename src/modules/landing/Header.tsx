"use client";
import {
  IconDashboard,
  IconLogout,
  IconMenu2,
  IconRobot,
  IconSettings,
  IconShoppingBag,
  IconX,
} from "@tabler/icons-react";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AgentKitLogo } from "@/shared/ui/agentkit-logo";
import { Button } from "@/shared/ui/button";
import { useLogout } from "@/utils/auth";
import { clearStorage } from "@/utils/clearStorage";
import { REFRESH_TOKEN } from "@/utils/constants";

import { AccountDropdown } from "./components/AccountDropdown";

export const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutDisabled, setIsLogoutDisabled] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const token = getCookie(REFRESH_TOKEN);
  const { mutateAsync: logout, isPending: isLogoutPending } = useLogout();

  const handleLogout = async () => {
    if (isLogoutDisabled || isLogoutPending) return;

    setIsLogoutDisabled(true);
    try {
      await logout(token);
      clearStorage();
      toast.success("Sign Out successful. See you soon!");
      window.dispatchEvent(new Event("auth-change"));
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLogoutDisabled(false);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = getCookie(REFRESH_TOKEN);
      setIsAuthenticated(!!token);
    };

    checkAuth();
    setMounted(true);

    // Listen for auth change events (e.g., after logout)
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full py-4">
      <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div
          className="rounded-md px-8 py-2 glass-panel"
          style={{
            background:
              "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0.05) 100%)",
            backdropFilter: "blur(32px) saturate(180%)",
            WebkitBackdropFilter: "blur(32px) saturate(180%)",
          }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="shrink-0 hover:opacity-80 transition-opacity">
              <AgentKitLogo size="md" />
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-2">
                {["Marketplace", "Start Building"].map((item) => {
                  const href =
                    item === "Start Building"
                      ? "/start-building"
                      : item === "Marketplace"
                        ? "/marketplace"
                        : "/";
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={item}
                      href={href}
                      className={`px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-all rounded-md hover:bg-white/5 ${isActive ? "bg-white/5 text-white" : ""
                        }`}
                    >
                      {item === "Marketplace" ? (
                        <span className="flex items-center gap-2">
                          <IconShoppingBag size={16} />
                          {item}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <IconRobot size={16} />
                          {item}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
              </button>

              {isAuthenticated === null ? (
                <div className="hidden md:flex items-center gap-3">
                  {/* Loading skeleton */}
                  {/* <div className="w-16 h-9 bg-white/5 rounded-md animate-pulse" />
                  <div className="w-24 h-9 bg-white/5 rounded-md animate-pulse" /> */}
                </div>
              ) : isAuthenticated ? (
                <AccountDropdown />
              ) : (
                <>
                  <Button
                    asChild
                    className="hidden md:flex gold-gradient text-black font-medium rounded-md px-4 py-2 h-9 shadow-lg hover:brightness-110 transition-all"
                  >
                    <Link href="/auth/login">Sign in</Link>
                  </Button>
                  {/* <Button
                    asChild
                    className="hidden md:flex items-center justify-center gold-gradient text-black font-bold rounded-md px-6 py-2 shadow-lg hover:brightness-110 transition-all"
                  >
                    <Link href="/auth/register">Get Started</Link>
                  </Button> */}
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-white/10">
              <nav className="flex flex-col gap-2">
                {["Marketplace", "Start Building"].map((item) => {
                  const href =
                    item === "Start Building"
                      ? "/start-building"
                      : item === "Marketplace"
                        ? "/marketplace"
                        : "/";
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={item}
                      href={href}
                      className={`px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-all rounded-md hover:bg-white/5 ${isActive ? "bg-white/5 text-white" : ""
                        }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item === "Marketplace" ? (
                        <span className="flex items-center gap-2">
                          <IconShoppingBag size={16} />
                          {item}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <IconRobot size={16} />
                          {item}
                        </span>
                      )}
                    </Link>
                  );
                })}
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2 mt-2">
                    <Link
                      href="/user-dashboard"
                      className="text-center text-slate-300 hover:text-white font-medium text-sm transition-colors px-4 py-2 border border-white/10 rounded-md flex items-center justify-center gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <IconDashboard size={16} />
                      Dashboard
                    </Link>
                    <Link
                      href="/account-settings"
                      className="text-center text-slate-300 hover:text-white font-medium text-sm transition-colors px-4 py-2 border border-white/10 rounded-md flex items-center justify-center gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <IconSettings size={16} />
                      Account Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      disabled={isLogoutDisabled || isLogoutPending}
                      className="text-center text-red-600 hover:text-red-500 font-medium text-sm transition-colors px-4 py-2 border border-white/10 rounded-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <IconLogout size={16} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mt-2">
                    <Link
                      href="/auth/login"
                      className="text-center gold-gradient bg-primary text-black font-medium rounded-md px-4 py-2 border border-white/10 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
