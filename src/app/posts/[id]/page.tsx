import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Clock, Tag, Pencil, Trash2 } from "lucide-react";
import { fetchPostById } from "@/lib/firestore";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CommentList } from "@/components/comments/CommentList";
import { CommentForm } from "@/components/comments/CommentForm";
import { PostDetailActions } from "./PostDetailActions";
import { ModalController } from "@/components/posts/ModalController";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const post = await fetchPostById(id);
    if (!post) return { title: "Post Not Found" };
    return {
      title: post.title,
      description: post.excerpt,
    };
  } catch {
    return { title: "Post" };
  }
}

function estimateReadTime(content: string) {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const post = await fetchPostById(id);
  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="max-w-2xl mx-auto">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors mb-8 group"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            All Posts
          </Link>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5 animate-fade-in">
              <Tag size={13} className="text-accent mt-0.5" />
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/?tag=${encodeURIComponent(tag)}`}
                  className="tag-pill"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl font-bold text-ink leading-tight mb-5 animate-slide-up"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {post.title}
          </h1>

          {/* Meta + Actions */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-8 pb-6 border-b border-border animate-slide-up stagger-1">
            <div
              className="flex items-center gap-4 text-sm text-muted"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <span className="font-medium text-ink/80">{post.author}</span>
              <span>·</span>
              <span>{format(new Date(post.createdAt), "MMMM d, yyyy")}</span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {estimateReadTime(post.content)} min read
              </span>
            </div>

            {/* Edit/Delete — client component to access Zustand */}
            <PostDetailActions postId={post.id} />
          </div>

          {/* Excerpt */}
          <p
            className="text-lg text-muted italic leading-relaxed mb-8 animate-slide-up stagger-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {post.excerpt}
          </p>

          {/* Content */}
          <div className="prose-article animate-slide-up stagger-3">
            {post.content.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Divider */}
          <div className="ornament my-12" />

          {/* Comments */}
          <CommentList postId={post.id} />

          <div className="mt-8 pt-6 border-t border-border">
            <CommentForm postId={post.id} />
          </div>
        </div>
      </main>
      <Footer />
      <ModalController />
    </>
  );
}
