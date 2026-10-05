import { Inter } from "next/font/google";
import Script from "next/script";

import EnvScript from "@/components/EnvScript";
import { RECAPTCHA_ENABLED, RECAPTCHA_KEY } from "@/config";
import { I18nProvider } from "@/providers/I18nProvider";
import { MuiAppRouterCache } from "@/providers/MuiAppRouterCache";
import { QueryProvider } from "@/providers/QueryProvider";

import type { Metadata } from "next";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Workforce Hub",
  description: "Deploy intelligent AI agents to automate business processes.",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} antialiased font-sans`} suppressHydrationWarning>
        <EnvScript />
        {RECAPTCHA_ENABLED && RECAPTCHA_KEY && (
          <Script
            src={`https://www.google.com/recaptcha/enterprise.js?render=${RECAPTCHA_KEY}`}
            strategy="afterInteractive"
          />
        )}
        <QueryProvider>
          <MuiAppRouterCache>
            <I18nProvider>{children}</I18nProvider>
          </MuiAppRouterCache>
        </QueryProvider>
        <div id="portal" />
      </body>
    </html>
  );
};

export default RootLayout;
