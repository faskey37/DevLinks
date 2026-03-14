"use client";

/**
 * @file src/components/LinkCard.tsx
 * @description A single link card in the dashboard — supports inline editing, deletion, and drag handle.
 *
 * What it does:
 * - Displays a link's title, URL, and click count in view mode
 * - Toggles into an inline edit form when user clicks "Edit"
 * - Shows a delete confirmation before removing
 * - Exposes a drag handle icon for react-beautiful-dnd reordering
 *
 * Props:
 * - `link`       → the Link object to display
 * - `isDragging` → passed by Draggable; adds visual feedback during drag
 * - `onUpdate`   → callback to save edits (calls Firestore via useLinks hook)
 * - `onDelete`   → callback to delete (calls Firestore via useLinks hook)
 *
 * Pattern: Controlled inline edit form using local state
 */

import { useState } from "react";
import { Link } from "@/types";
import { LinkFormValues } from "@/types";
import { isValidUrl } from "@/lib/utils";
import { GripVertical, Edit2, Trash2, Check, X, ExternalLink, MousePointerClick } from "lucide-react";

interface LinkCardProps {
  link: Link;
  isDragging: boolean;
  onUpdate: (data: Partial<LinkFormValues>) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function LinkCard({ link, isDragging, onUpdate, onDelete }: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link.title);
  const [editUrl, setEditUrl] = useState(link.url);
  const [urlError, setUrlError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSave() {
    if (!editTitle.trim()) return;
    if (!isValidUrl(editUrl)) {
      setUrlError("Please enter a valid URL (https://...)");
      return;
    }
    setSaving(true);
    await onUpdate({ title: editTitle.trim(), url: editUrl.trim() });
    setSaving(false);
    setIsEditing(false);
    setUrlError("");
  }

  function handleCancel() {
    setEditTitle(link.title);
    setEditUrl(link.url);
    setUrlError("");
    setIsEditing(false);
  }

  return (
    <div
      className={`group rounded-2xl border bg-card p-4 transition ${
        isDragging
          ? "border-brand-400 shadow-lg scale-[1.02]"
          : "border-border hover:border-brand-200 dark:hover:border-brand-800"
      }`}
    >
      {isEditing ? (
        /* ── Edit Mode ─────────────────────────────── */
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Title</label>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400"
              placeholder="Link title"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">URL</label>
            <input
              value={editUrl}
              onChange={(e) => { setEditUrl(e.target.value); setUrlError(""); }}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400"
              placeholder="https://..."
            />
            {urlError && <p className="mt-1 text-xs text-destructive">{urlError}</p>}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" />
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-1.5 text-xs font-medium hover:bg-muted"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* ── View Mode ─────────────────────────────── */
        <div className="flex items-center gap-3">
          {/* Drag handle */}
          <GripVertical className="h-5 w-5 flex-shrink-0 cursor-grab text-muted-foreground/40 group-hover:text-muted-foreground active:cursor-grabbing" />

          {/* Link info */}
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{link.title}</p>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 truncate text-xs text-brand-500 hover:underline"
            >
              {link.url}
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          </div>

          {/* Click count */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MousePointerClick className="h-3.5 w-3.5" />
            {link.clicks ?? 0}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              title="Edit link"
            >
              <Edit2 className="h-4 w-4" />
            </button>

            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={onDelete}
                  className="rounded-lg px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-lg px-2 py-1 text-xs font-medium hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                title="Delete link"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}