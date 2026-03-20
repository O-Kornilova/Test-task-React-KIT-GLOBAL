"use client";
import Link from "next/link";
import { PenLine } from "lucide-react";
import { useModalStore } from "@/store";

export function Header() {
  const openModal = useModalStore((s) => s.openModal);

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="text-accent text-2xl leading-none" style={{ fontFamily: "var(--font-display)" }}>
            ✦
          </span>
          <span
            className="text-xl font-semibold tracking-tight text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Inkwell
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-muted hover:text-ink transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            All Posts
          </Link>
        </nav>

        {/* CTA */}
        <button
          onClick={() => openModal("create")}
          className="btn-primary"
        >
          <PenLine size={15} />
          <span>New Post</span>
        </button>
      </div>
    </header>
  );
}
