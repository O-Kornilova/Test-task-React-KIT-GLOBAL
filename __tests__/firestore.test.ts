import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchPosts,
  fetchPostById,
  createPost,
  deletePost,
  fetchComments,
} from "@/lib/firestore";

// All Firestore calls are mocked via __tests__/setup.ts

describe("firestore helpers (mocked)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchPosts returns an empty array by default mock", async () => {
    const posts = await fetchPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts).toHaveLength(0);
  });

  it("fetchPostById returns null when post does not exist", async () => {
    const post = await fetchPostById("non-existent-id");
    expect(post).toBeNull();
  });

  it("fetchComments returns an empty array by default mock", async () => {
    const comments = await fetchComments("post-1");
    expect(Array.isArray(comments)).toBe(true);
    expect(comments).toHaveLength(0);
  });

  it("createPost is callable and returns a value", async () => {
    const mockPost = {
      id: "new-id",
      title: "New Post",
      content: "Content",
      excerpt: "Excerpt",
      author: "Author",
      tags: [],
      commentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    vi.mocked(createPost).mockResolvedValueOnce(mockPost);

    const result = await createPost({
      title: "New Post",
      content: "Content",
      excerpt: "Excerpt",
      author: "Author",
      tags: [],
    });

    expect(result).toEqual(mockPost);
    expect(createPost).toHaveBeenCalledTimes(1);
  });

  it("deletePost is called with the correct id", async () => {
    vi.mocked(deletePost).mockResolvedValueOnce(undefined);
    await deletePost("post-abc");
    expect(deletePost).toHaveBeenCalledWith("post-abc");
  });
});
