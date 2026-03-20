"use client";
import { useToastStore } from "@/store";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import clsx from "clsx";

const icons = {
  success: <CheckCircle size={16} className="text-success shrink-0" />,
  error: <XCircle size={16} className="text-danger shrink-0" />,
  info: <Info size={16} className="text-accent shrink-0" />,
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            "pointer-events-auto flex items-start gap-3 bg-paper-soft border border-border rounded-sm px-4 py-3 shadow-card animate-slide-up max-w-sm",
            toast.kind === "error" && "border-danger/30"
          )}
        >
          {icons[toast.kind]}
          <p className="text-sm text-ink flex-1 leading-snug" style={{ fontFamily: "var(--font-body)" }}>
            {toast.message}
          </p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-muted hover:text-ink transition-colors mt-0.5 shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
