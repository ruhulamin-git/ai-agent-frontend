import type { FilterType } from "@/types";
import type { PaginationState } from "@tanstack/react-table";

const GOOGLE_SCOPE = "openid email profile";

const LINKEDIN_SCOPE = "openid profile email";

const ASSESS_TOKEN = "nextjs_access_token";

const REFRESH_TOKEN = "nextjs_refresh_token";

const TRUNCATE = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  display: "inline-block",
};

const PROVIDER_TYPES = [
  { value: "oauth", label: "OAuth" },
  { value: "api_key", label: "API Key" },
];

const LANGUAGE = [
  { value: "en", label: "English (UK)" },
  { value: "fr", label: "French" },
  { value: "ar", label: "Arabic" },
];

const CURRENCY = [
  { value: "usd", label: "US Dollar" },
  { value: "try", label: "Turkish Lira" },
];

const INITIAL_FILTERS: FilterType = [];

const INITIAL_PAGINATION: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
};

const DEFAULT_UNLIMITED_VALUE = 9999999;

export {
  ASSESS_TOKEN,
  CURRENCY,
  DEFAULT_UNLIMITED_VALUE,
  GOOGLE_SCOPE,
  INITIAL_FILTERS,
  INITIAL_PAGINATION,
  LANGUAGE,
  LINKEDIN_SCOPE,
  PROVIDER_TYPES,
  REFRESH_TOKEN,
  TRUNCATE,
};
