import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconPlug,
} from "@tabler/icons-react";

export const getProviderIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case "facebook":
      return IconBrandFacebook;
    case "whatsapp":
      return IconBrandWhatsapp;
    case "telegram":
      return IconBrandTelegram;
    case "instagram":
      return IconBrandInstagram;
    default:
      return IconPlug;
  }
};

export const getProviderStyles = (name: string) => {
  switch (name.toLowerCase()) {
    case "facebook":
      return {
        iconColor: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-500/10",
        borderColor: "border-blue-200 dark:border-blue-500/20",
      };
    case "whatsapp":
      return {
        iconColor: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-500/10",
        borderColor: "border-green-200 dark:border-green-500/20",
      };
    case "telegram":
      return {
        iconColor: "text-sky-500 dark:text-sky-400",
        bgColor: "bg-sky-50 dark:bg-sky-500/10",
        borderColor: "border-sky-200 dark:border-sky-500/20",
      };
    case "instagram":
      return {
        iconColor: "text-pink-600 dark:text-pink-400",
        bgColor: "bg-pink-50 dark:bg-pink-500/10",
        borderColor: "border-pink-200 dark:border-pink-500/20",
      };
    default:
      return {
        iconColor: "text-slate-600 dark:text-slate-400",
        bgColor: "bg-slate-50 dark:bg-slate-500/10",
        borderColor: "border-slate-200 dark:border-slate-500/20",
      };
  }
};
