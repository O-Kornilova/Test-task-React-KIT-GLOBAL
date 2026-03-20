import clsx from "clsx";
import { forwardRef } from "react";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  as?: "input" | "textarea";
  rows?: number;
}

export const Field = forwardRef<
  HTMLInputElement & HTMLTextAreaElement,
  FieldProps
>(function Field({ label, error, hint, as = "input", rows = 4, className, ...props }, ref) {
  const Tag = as;
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink" style={{ fontFamily: "var(--font-body)" }}>
        {label}
        {props.required && <span className="text-accent ml-1">*</span>}
      </label>

      {/* @ts-expect-error — unified ref */}
      <Tag
        ref={ref}
        rows={as === "textarea" ? rows : undefined}
        className={clsx(
          "field-input",
          as === "textarea" && "resize-none",
          error && "error",
          className
        )}
        {...props}
      />

      {hint && !error && (
        <p className="text-xs text-muted" style={{ fontFamily: "var(--font-body)" }}>
          {hint}
        </p>
      )}
      {error && (
        <p className="text-xs text-danger" style={{ fontFamily: "var(--font-body)" }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
