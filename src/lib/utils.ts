import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Language, LocalizedText } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Resolves admin-entered text to the visitor's language. Handles legacy records
// (saved before multi-language support existed) that still store a plain string.
export function localize(value: LocalizedText | string | undefined | null, language: Language): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[language] || value.en || value.fr || value.rw || "";
}

// True if `query` matches any language variant of `value` — used so search still
// finds a product/description regardless of which language it was typed in.
export function matchesLocalizedText(value: LocalizedText | string | undefined | null, query: string): boolean {
  if (!value || !query) return false;
  const q = query.toLowerCase();
  if (typeof value === "string") return value.toLowerCase().includes(q);
  return [value.en, value.fr, value.rw].some((v) => (v || "").toLowerCase().includes(q));
}

// Display label for a category name — falls back to the canonical (English) name
// when no translation was entered, so nothing is ever shown blank.
export function getCategoryLabel(
  name: string,
  language: Language,
  translations?: Record<string, { fr?: string; rw?: string }>
): string {
  if (language === "en") return name;
  const t = translations?.[name];
  return (t && t[language]) || name;
}

// Descriptive marketing color names that have no valid CSS equivalent.
const COLOR_NAME_ALIASES: Record<string, string> = {
  titanium: "#8a8d8f",
  champagne: "#f7e7ce",
  emerald: "#50c878",
  oatmeal: "#ddd0c0",
  nude: "#e3bc9a",
  mustard: "#ffdb58",
  steel: "#71797e",
};

function isValidCssColor(value: string): boolean {
  return typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("color", value);
}

// Resolves a product variation's color name (e.g. "Natural Titanium") to a real,
// always-visible CSS color — falling back through direct match, individual words,
// a small alias table, then a deterministic hash so no swatch is ever left blank.
export function resolveColorSwatch(value: string): string {
  const concatenated = value.toLowerCase().replace(/[\s/]+/g, "");
  if (isValidCssColor(concatenated)) return concatenated;

  const words = value.toLowerCase().split(/[\s/]+/).filter(Boolean).reverse();
  for (const word of words) {
    if (isValidCssColor(word)) return word;
  }
  for (const word of words) {
    if (COLOR_NAME_ALIASES[word]) return COLOR_NAME_ALIASES[word];
  }

  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 55%, 55%)`;
}
