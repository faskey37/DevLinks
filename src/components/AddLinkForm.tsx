"use client";

/**
 * @file src/components/AddLinkForm.tsx
 * @description Form component for adding a new link in the dashboard.
 *
 * What it does:
 * - Renders a card-style form with Title and URL inputs
 * - Validates using react-hook-form + zod (type-safe runtime validation)
 * - Calls `onAdd(data)` on valid submission → parent saves to Firestore
 * - Calls `onCancel()` to collapse back to the "+ Add Link" button
 *
 * Validation rules:
 * - Title: required, 1–60 characters
 * - URL: must be a valid http/https URL
 *
 * Why zod?
 * - Zod schemas are TypeScript-native — the inferred type matches form values automatically
 * - Much cleaner than writing manual validation logic
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LinkFormValues } from "@/types";
import { Loader2, PlusCircle } from "lucide-react";

const schema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(60, "Title must be under 60 characters"),
  url: z
    .string()
    .url("Please enter a valid URL (https://...)")
    .startsWith("http", "URL must start with http:// or https://"),
  icon: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface AddLinkFormProps {
  onAdd: (data: LinkFormValues) => Promise<void>;
  onCancel: () => void;
}

export function AddLinkForm({ onAdd, onCancel }: AddLinkFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    await onAdd(data);
    reset();
  }

  return (
    <div className="mb-6 rounded-2xl border border-brand-200 bg-card p-5 shadow-sm dark:border-brand-800">
      <h3 className="font-display mb-4 font-semibold">New Link</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title field */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Title <span className="text-destructive">*</span>
          </label>
          <input
            {...register("title")}
            placeholder="My GitHub"
            autoFocus
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-400"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* URL field */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            URL <span className="text-destructive">*</span>
          </label>
          <input
            {...register("url")}
            type="url"
            placeholder="https://github.com/yourusername"
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-400"
          />
          {errors.url && (
            <p className="mt-1 text-xs text-destructive">{errors.url.message}</p>
          )}
        </div>

        {/* Icon (optional emoji) */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Icon <span className="text-xs text-muted-foreground">(optional emoji)</span>
          </label>
          <input
            {...register("icon")}
            placeholder="🔗"
            className="w-24 rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}
            Add Link
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}