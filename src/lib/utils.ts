/**
 * @file src/lib/utils.ts
 * @description Shared utility functions used across the app.
 *
 * Functions:
 * - `cn(...inputs)`   – Merges Tailwind class names safely (handles conflicts like `p-2 p-4`)
 * - `slugify(text)`   – Converts a display name to a URL-safe username slug
 * - `isValidUrl(url)` – Checks if a string is a valid HTTP/HTTPS URL
 *
 * Why `cn` exists:
 * Tailwind classes can conflict. For example `cn("p-2", condition && "p-4")` without merging
 * would produce `"p-2 p-4"` and the browser applies the last one unpredictably.
 * `tailwind-merge` resolves conflicts; `clsx` handles conditional class logic cleanly.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge and deduplicate Tailwind CSS class names */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert a name into a lowercase, URL-safe slug.
 * Example: "John Doe 123!" → "john-doe-123"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")   // remove non-alphanumeric
    .replace(/\s+/g, "-")            // spaces → hyphens
    .replace(/-+/g, "-");            // collapse multiple hyphens
}

/**
 * Check if a string is a valid absolute URL (http or https only).
 * Used when validating links a user adds to their profile.
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}