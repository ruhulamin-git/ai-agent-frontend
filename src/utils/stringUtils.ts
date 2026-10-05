/**
 * Converts snake_case strings to Title Case
 * @param str - The string to convert
 * @returns The converted string in Title Case
 */
export const snakeToTitleCase = (str: string): string => {
  if (!str) return "";
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Converts any string to Title Case
 * @param str - The string to convert
 * @returns The converted string in Title Case
 */
export const toTitleCase = (str: string): string => {
  if (!str) return "";
  return str
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
