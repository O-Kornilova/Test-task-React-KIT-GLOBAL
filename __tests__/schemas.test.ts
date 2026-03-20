import { describe, it, expect } from "vitest";
import { postSchema, commentSchema, filterSchema } from "@/schemas";

// ─── postSchema ───────────────────────────────────────────────────────────────

describe("postSchema", () => {
  const valid = {
    title: "My First Post",
    content: "This is valid content that is long enough.",
    excerpt: "A short teaser text here.",
    author: "Alex",
    tags: "react, typescript, next",
  };

  it("accepts a valid post", () => {
    const result = postSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("transforms comma-separated tags into an array", () => {
    const result = postSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual(["react", "typescript", "next"]);
    }
  });

  it("trims and lowercases tags", () => {
    const result = postSchema.safeParse({ ...valid, tags: " React , TypeScript " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual(["react", "typescript"]);
    }
  });

  it("filters empty tag entries", () => {
    const result = postSchema.safeParse({ ...valid, tags: "react,,  , next" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual(["react", "next"]);
    }
  });

  it("rejects a title that is too short", () => {
    const result = postSchema.safeParse({ ...valid, title: "Hi" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].path).toContain("title");
    }
  });

  it("rejects a title that is too long", () => {
    const result = postSchema.safeParse({ ...valid, title: "A".repeat(121) });
    expect(result.success).toBe(false);
  });

  it("rejects content shorter than 10 characters", () => {
    const result = postSchema.safeParse({ ...valid, content: "Too short" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].path).toContain("content");
    }
  });

  it("rejects more than 8 tags", () => {
    const result = postSchema.safeParse({
      ...valid,
      tags: "a,b,c,d,e,f,g,h,i",
    });
    expect(result.success).toBe(false);
  });

  it("accepts empty tags string (produces empty array)", () => {
    const result = postSchema.safeParse({ ...valid, tags: "" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual([]);
    }
  });

  it("rejects a missing required field", () => {
    const { title: _omit, ...noTitle } = valid;
    const result = postSchema.safeParse(noTitle);
    expect(result.success).toBe(false);
  });
});

// ─── commentSchema ────────────────────────────────────────────────────────────

describe("commentSchema", () => {
  const valid = { author: "Jane", content: "Great article!" };

  it("accepts a valid comment", () => {
    expect(commentSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects author shorter than 2 characters", () => {
    const result = commentSchema.safeParse({ ...valid, author: "J" });
    expect(result.success).toBe(false);
  });

  it("rejects content shorter than 3 characters", () => {
    const result = commentSchema.safeParse({ ...valid, content: "Hi" });
    expect(result.success).toBe(false);
  });

  it("rejects content longer than 1000 characters", () => {
    const result = commentSchema.safeParse({ ...valid, content: "A".repeat(1001) });
    expect(result.success).toBe(false);
  });

  it("rejects missing author", () => {
    const result = commentSchema.safeParse({ content: "Nice!" });
    expect(result.success).toBe(false);
  });
});

// ─── filterSchema ─────────────────────────────────────────────────────────────

describe("filterSchema", () => {
  it("applies defaults for empty input", () => {
    const result = filterSchema.parse({});
    expect(result.search).toBe("");
    expect(result.tag).toBe("");
    expect(result.sortBy).toBe("createdAt");
    expect(result.sortOrder).toBe("desc");
  });

  it("accepts valid sortBy values", () => {
    expect(filterSchema.safeParse({ sortBy: "title" }).success).toBe(true);
    expect(filterSchema.safeParse({ sortBy: "commentCount" }).success).toBe(true);
  });

  it("rejects an invalid sortBy value", () => {
    const result = filterSchema.safeParse({ sortBy: "invalid" });
    expect(result.success).toBe(false);
  });

  it("accepts both sort orders", () => {
    expect(filterSchema.safeParse({ sortOrder: "asc" }).success).toBe(true);
    expect(filterSchema.safeParse({ sortOrder: "desc" }).success).toBe(true);
  });
});
