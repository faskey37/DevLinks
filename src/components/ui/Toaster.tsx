"use client";

/**
 * @file src/components/ui/Toaster.tsx
 * @description Global toast notification system.
 *
 * What it does:
 * - Renders toast messages (success, error, info) that appear in the bottom-right corner
 * - Auto-dismisses after 4 seconds
 * - Supports manual dismissal via a close button
 * - Can be triggered from anywhere using the `useToast` hook
 *
 * How to use in any component:
 * ```tsx
 * const { toast } = useToast();
 * toast({ title: "Saved!", description: "Your links have been updated.", type: "success" });
 * ```
 *
 * Pattern: Context + local state — Toaster subscribes to a global event emitter
 * This is a simplified implementation; for production you'd use @radix-ui/react-toast
 */

import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (options: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const icons = {
  success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  error:   <AlertCircle className="h-5 w-5 text-destructive" />,
  info:    <Info className="h-5 w-5 text-brand-500" />,
};

export function Toaster({ children }: { children?: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((options: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...options, id }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex w-80 items-start gap-3 rounded-2xl border bg-card p-4 shadow-lg animate-slide-in",
              t.type === "error" && "border-destructive/30",
              t.type === "success" && "border-green-300/30",
              t.type === "info" && "border-brand-300/30"
            )}
          >
            {icons[t.type]}
            <div className="flex-1">
              <p className="text-sm font-semibold">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}