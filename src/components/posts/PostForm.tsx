"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, type PostFormValues } from "@/schemas";
import { Field } from "@/components/ui/Field";
import { Loader2 } from "lucide-react";
import type { Post } from "@/types";

interface PostFormProps {
  defaultValues?: Partial<PostFormValues>;
  onSubmit: (data: PostFormValues) => Promise<void>;
  isMutating: boolean;
  submitLabel?: string;
  post?: Post; // used when editing — pre-fills tags as CSV
}

export function PostForm({
  defaultValues,
  onSubmit,
  isMutating,
  submitLabel = "Publish Post",
  post,
}: PostFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title ?? defaultValues?.title ?? "",
      excerpt: post?.excerpt ?? defaultValues?.excerpt ?? "",
      content: post?.content ?? defaultValues?.content ?? "",
      author: post?.author ?? defaultValues?.author ?? "",
      // Convert tags array back to CSV for editing
      tags: (post?.tags ?? defaultValues?.tags ?? []).toString(),
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <Field
        label="Title"
        required
        placeholder="What's your post about?"
        error={errors.title?.message}
        {...register("title")}
      />

      <Field
        label="Author"
        required
        placeholder="Your name"
        error={errors.author?.message}
        {...register("author")}
      />

      <Field
        as="textarea"
        rows={2}
        label="Excerpt"
        required
        placeholder="A short teaser shown in the post list…"
        error={errors.excerpt?.message}
        hint="Max 300 characters"
        {...register("excerpt")}
      />

      <Field
        as="textarea"
        rows={8}
        label="Content"
        required
        placeholder="Write your post here… Markdown-like formatting is supported in preview."
        error={errors.content?.message}
        {...register("content")}
      />

      <Field
        label="Tags"
        placeholder="react, typescript, webdev"
        error={errors.tags?.message}
        hint="Comma-separated, max 8 tags"
        {...register("tags")}
      />

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isMutating}
          className="btn-primary min-w-[140px] justify-center"
        >
          {isMutating ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Saving…</span>
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
