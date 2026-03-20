import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center py-32 text-center">
        <p
          className="text-8xl font-bold text-accent/30 mb-4 select-none"
          style={{ fontFamily: "var(--font-display)" }}
          aria-hidden
        >
          404
        </p>
        <h1
          className="text-3xl font-bold text-ink mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Page not found
        </h1>
        <p
          className="text-muted text-base mb-8 max-w-xs"
          style={{ fontFamily: "var(--font-body)", fontStyle: "italic" }}
        >
          The post you're looking for may have been moved or deleted.
        </p>
        <Link href="/" className="btn-primary">
          ← Back to all posts
        </Link>
      </main>
      <Footer />
    </>
  );
}
