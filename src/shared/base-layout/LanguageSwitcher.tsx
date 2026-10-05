import { IconCheck } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { changeLanguage } from "@/utils/i18n";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "bn", name: "বাংলা", flag: "🇧🇩" },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = async (langCode: string) => {
    await changeLanguage(langCode);
    localStorage.setItem("language", langCode);
  };

  if (!currentLang) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex h-9 items-center gap-2 px-2 text-muted-foreground hover:text-foreground"
        >
          <span className="text-lg">{currentLang.flag}</span>
          <span className="hidden text-sm font-medium sm:inline">{currentLang.name}</span>
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="cursor-pointer"
          >
            <span className="mr-2 text-xl">{lang.flag}</span>
            <span className="flex-1">{lang.name}</span>
            {lang.code === currentLang.code && <IconCheck className="ml-2 h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
