import { z } from "zod";

// ─── Post Schema ────────────────────────────────────────────────────────────

export const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title must be under 120 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(20000, "Content is too long"),
  excerpt: z
    .string()
    .min(10, "Excerpt must be at least 10 characters")
    .max(300, "Excerpt must be under 300 characters"),
  author: z
    .string()
    .min(2, "Author name must be at least 2 characters")
    .max(60, "Author name is too long"),
  tags: z
    .string()
    .transform((val) =>
      val
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
    )
    .pipe(
      z.array(z.string().min(1)).max(8, "Maximum 8 tags allowed")
    ),
});

export type PostFormValues = z.input<typeof postSchema>;
export type PostFormOutput = z.output<typeof postSchema>;

// ─── Comment Schema ──────────────────────────────────────────────────────────

export const commentSchema = z.object({
  author: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name is too long"),
  content: z
    .string()
    .min(3, "Comment must be at least 3 characters")
    .max(1000, "Comment must be under 1000 characters"),
});

export type CommentFormValues = z.infer<typeof commentSchema>;

// ─── Filter Schema ───────────────────────────────────────────────────────────

export const filterSchema = z.object({
  search: z.string().max(100).default(""),
  tag: z.string().max(40).default(""),
  sortBy: z.enum(["createdAt", "title", "commentCount"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
