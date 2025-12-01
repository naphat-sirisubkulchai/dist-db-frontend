import truncate from "html-truncate";

/**
 * Generate a styled excerpt from TipTap HTML content.
 * Keeps all styles (bold, italic, highlight, headings, lists).
 *
 * @param html - The full HTML content
 * @param length - Maximum characters to keep
 */
export function getExcerpt(html: string, length: number = 200): string {
  if (!html) return "";
  return truncate(html, length);
}
