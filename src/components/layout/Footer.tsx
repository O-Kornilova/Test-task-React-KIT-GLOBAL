export function Footer() {
  return (
    <footer className="border-t border-border mt-24 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="ornament text-sm text-muted">
          <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>
            Inkwell
          </span>
        </div>
        <p className="text-center text-xs text-muted mt-4" style={{ fontFamily: "var(--font-body)" }}>
          Built with Next.js 15 · SWR · Zustand · Firebase · TypeScript
        </p>
      </div>
    </footer>
  );
}
