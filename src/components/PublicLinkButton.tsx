"use client";

import type { Link } from "@/types";
import { ExternalLink } from "lucide-react";

interface Props {
  link: Link;
  userId: string;
}

/** Auto-detect social platform from URL and return emoji icon */
function getSocialIcon(url: string): string {
  const u = url.toLowerCase();
  if (u.includes("github.com"))       return "🐙";
  if (u.includes("linkedin.com"))     return "💼";
  if (u.includes("twitter.com") || u.includes("x.com")) return "🐦";
  if (u.includes("youtube.com"))      return "▶️";
  if (u.includes("instagram.com"))    return "📸";
  if (u.includes("dribbble.com"))     return "🎨";
  if (u.includes("behance.net"))      return "🖌️";
  if (u.includes("medium.com"))       return "✍️";
  if (u.includes("dev.to"))           return "👩‍💻";
  if (u.includes("hashnode"))         return "📝";
  if (u.includes("stackoverflow"))    return "💡";
  if (u.includes("codepen.io"))       return "🖊️";
  if (u.includes("figma.com"))        return "🎯";
  if (u.includes("notion.so"))        return "📋";
  if (u.includes("discord"))          return "💬";
  if (u.includes("telegram"))         return "✈️";
  if (u.includes("whatsapp"))         return "💚";
  if (u.includes("mailto:"))          return "📧";
  return "🔗";
}

/** Get background color class based on platform */
function getSocialColor(url: string): string {
  const u = url.toLowerCase();
  if (u.includes("github.com"))       return "group-hover:border-gray-400 group-hover:bg-gray-50 dark:group-hover:bg-gray-900/30";
  if (u.includes("linkedin.com"))     return "group-hover:border-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20";
  if (u.includes("twitter.com") || u.includes("x.com")) return "group-hover:border-sky-400 group-hover:bg-sky-50 dark:group-hover:bg-sky-900/20";
  if (u.includes("youtube.com"))      return "group-hover:border-red-400 group-hover:bg-red-50 dark:group-hover:bg-red-900/20";
  if (u.includes("instagram.com"))    return "group-hover:border-pink-400 group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20";
  return "group-hover:border-brand-300 group-hover:bg-brand-50 dark:group-hover:border-brand-700 dark:group-hover:bg-brand-900/20";
}

export function PublicLinkButton({ link, userId }: Props) {
  const icon = link.icon || getSocialIcon(link.url);
  const colorClass = getSocialColor(link.url);

  async function handleClick() {
    // Fire-and-forget click tracking
    fetch("/api/links/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, linkId: link.id }),
    }).catch(() => {});

    window.open(link.url, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      onClick={handleClick}
      className={`group flex w-full items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] ${colorClass}`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-lg transition group-hover:scale-110">
          {icon}
        </span>
        <span className="font-display font-semibold">{link.title}</span>
      </div>
      <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground transition group-hover:text-foreground" />
    </button>
  );
}