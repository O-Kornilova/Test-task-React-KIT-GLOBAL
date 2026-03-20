"use client";
import { format } from "date-fns";
import { Trash2, MessageSquare } from "lucide-react";
import { useComments, useDeleteComment } from "@/hooks/useComments";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Comment } from "@/types";

function CommentItem({
  comment,
  onDelete,
  isDeleting,
}: {
  comment: Comment;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  return (
    <div className="group flex gap-4 py-4 border-b border-border last:border-0 animate-fade-in">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0 mt-0.5">
        <span
          className="text-xs font-semibold text-accent-dark"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {comment.author.charAt(0).toUpperCase()}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2.5">
            <span
              className="text-sm font-semibold text-ink"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {comment.author}
            </span>
            <span className="text-xs text-muted">
              {format(new Date(comment.createdAt), "MMM d, yyyy 'at' HH:mm")}
            </span>
          </div>

          <button
            onClick={() => onDelete(comment.id)}
            disabled={isDeleting}
            className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted hover:text-danger transition-all"
            title="Delete comment"
            aria-label="Delete comment"
          >
            <Trash2 size={13} />
          </button>
        </div>

        <p
          className="text-[0.9375rem] text-ink/80 leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {comment.content}
        </p>
      </div>
    </div>
  );
}

export function CommentList({ postId }: { postId: string }) {
  const { data: comments, isLoading } = useComments(postId);
  const { remove, isMutating } = useDeleteComment(postId);

  return (
    <section className="mt-12">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare size={18} className="text-accent" />
        <h2
          className="text-xl font-semibold text-ink"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Comments
          {comments && comments.length > 0 && (
            <span className="ml-2 text-base font-normal text-muted">
              ({comments.length})
            </span>
          )}
        </h2>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-4">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : !comments?.length ? (
        <p
          className="text-sm text-muted py-6"
          style={{ fontFamily: "var(--font-body)" }}
        >
          No comments yet. Be the first!
        </p>
      ) : (
        <div>
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              onDelete={remove}
              isDeleting={isMutating}
            />
          ))}
        </div>
      )}
    </section>
  );
}
