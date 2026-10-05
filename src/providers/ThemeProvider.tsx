"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

// Workaround for React 19 strict mode warning caused by next-themes injecting a script tag
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag while rendering React component")) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

export const ThemeProvider = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) => {
  return (
    <NextThemesProvider defaultTheme="dark" {...props}>
      {children}
    </NextThemesProvider>
  );
};
