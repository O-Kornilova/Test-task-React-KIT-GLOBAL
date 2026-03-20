import { FileText } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "No posts yet",
  description = "Be the first to share your thoughts.",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-paper-warm border border-border flex items-center justify-center mb-5">
        <FileText size={28} className="text-accent" />
      </div>
      <h3
        className="text-xl font-semibold text-ink mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h3>
      <p className="text-muted text-sm max-w-xs mb-6" style={{ fontFamily: "var(--font-body)" }}>
        {description}
      </p>
      {action}
    </div>
  );
}
