"use client";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";

import { i18n } from "@/utils/i18n";

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Initialize i18n on mount
    const savedLanguage = localStorage.getItem("language") || "en";
    i18n.changeLanguage(savedLanguage);
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
