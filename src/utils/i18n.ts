import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Lazy load language files
const loadLanguage = async (lang: string) => {
  switch (lang) {
    case "en":
      return (await import("@/languages/en.json")).default;
    case "fr":
      return (await import("@/languages/fr.json")).default;
    case "ar":
      return (await import("@/languages/ar.json")).default;
    case "bn":
      return (await import("@/languages/bn.json")).default;
    default:
      return (await import("@/languages/en.json")).default;
  }
};

// Initialize with minimal config
i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  resources: {}, // Start empty, load on demand
});

// Load default language
loadLanguage("en").then((translation) => {
  i18n.addResourceBundle("en", "translation", translation);
});

// Function to change language with lazy loading
export const changeLanguage = async (lang: string) => {
  if (!i18n.hasResourceBundle(lang, "translation")) {
    const translation = await loadLanguage(lang);
    i18n.addResourceBundle(lang, "translation", translation);
  }
  await i18n.changeLanguage(lang);
};

export { i18n };
