"use client";

import { IconWorld } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/shared/ui/dropdown-menu";

const languages = [
  { code: "en", name: "English" },
  { code: "bn", name: "বাংলা" },
  { code: "ar", name: "العربية" },
  { code: "fr", name: "Français" },
];

export const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <IconWorld className="mr-2 h-4 w-4" />
        <span>Language</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuRadioGroup value={i18n.language}>
          {languages.map((lang) => (
            <DropdownMenuRadioItem
              key={lang.code}
              value={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
            >
              {lang.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};
