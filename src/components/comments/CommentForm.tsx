"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema, type CommentFormValues } from "@/schemas";
import { Field } from "@/components/ui/Field";
import { useCreateComment } from "@/hooks/useComments";
import { Loader2, Send } from "lucide-react";

export function CommentForm({ postId }: { postId: string }) {
  const { post, isMutating } = useCreateComment(postId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data: CommentFormValues) => {
    await post(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <h3
        className="text-base font-semibold text-ink"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Leave a comment
      </h3>

      <Field
        label="Name"
        required
        placeholder="Your name"
        error={errors.author?.message}
        {...register("author")}
      />

      <Field
        as="textarea"
        rows={3}
        label="Comment"
        required
        placeholder="Share your thoughts…"
        error={errors.content?.message}
        {...register("content")}
      />

      <div className="flex justify-end">
        <button type="submit" disabled={isMutating} className="btn-primary">
          {isMutating ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Posting…
            </>
          ) : (
            <>
              <Send size={14} />
              Post Comment
            </>
          )}
        </button>
      </div>
    </form>
  );
}
