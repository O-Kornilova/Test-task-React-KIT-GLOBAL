"use client";
import Link from "next/link";
import { format } from "date-fns";
import { MessageSquare, Clock, Pencil, Trash2 } from "lucide-react";
import { useModalStore } from "@/store";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
  index?: number;
}

function estimateReadTime(content: string): number {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  const openModal = useModalStore((s) => s.openModal);

  const delayClass = [
    "stagger-1", "stagger-2", "stagger-3", "stagger-4", "stagger-5",
  ][Math.min(index, 4)];

  return (
    <article
      className={`card-surface p-6 flex flex-col gap-3 group animate-slide-up ${delayClass}`}
    >
      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <Link href={`/posts/${post.id}`}>
        <h2
          className="text-xl font-semibold text-ink leading-snug hover:text-accent transition-colors cursor-pointer"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {post.title}
        </h2>
      </Link>

      {/* Excerpt */}
      <p
        className="text-[0.9375rem] text-muted leading-relaxed line-clamp-3"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {post.excerpt}
      </p>

      {/* Meta row */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
        <div className="flex items-center gap-4 text-xs text-muted" style={{ fontFamily: "var(--font-body)" }}>
          <span className="font-medium text-ink/70">{post.author}</span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {estimateReadTime(post.content)} min read
          </span>
          <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
          <span className="flex items-center gap-1">
            <MessageSquare size={11} />
            {post.commentCount}
          </span>
        </div>

        {/* Actions — visible on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => openModal("edit", post.id)}
            className="p-1.5 rounded text-muted hover:text-ink hover:bg-paper-warm transition-colors"
            title="Edit post"
            aria-label="Edit post"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => openModal("delete", post.id)}
            className="p-1.5 rounded text-muted hover:text-danger hover:bg-danger/10 transition-colors"
            title="Delete post"
            aria-label="Delete post"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
