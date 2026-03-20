import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PostCard } from "@/components/posts/PostCard";
import { useModalStore } from "@/store";
import type { Post } from "@/types";

// ─── Test fixture ─────────────────────────────────────────────────────────────

const mockPost: Post = {
  id: "post-1",
  title: "Hello World",
  content: "This is the full content of the post, long enough to be meaningful.",
  excerpt: "A short teaser for the post.",
  author: "Alex",
  tags: ["react", "typescript"],
  commentCount: 3,
  createdAt: new Date("2025-06-15T10:00:00Z").toISOString(),
  updatedAt: new Date("2025-06-15T10:00:00Z").toISOString(),
};

describe("PostCard", () => {
  beforeEach(() => {
    useModalStore.setState({ modalType: null, targetPostId: null });
  });

  it("renders the post title", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders the post excerpt", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("A short teaser for the post.")).toBeInTheDocument();
  });

  it("renders the author name", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("Alex")).toBeInTheDocument();
  });

  it("renders all tags", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("typescript")).toBeInTheDocument();
  });

  it("renders comment count", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders a link to the post detail page", () => {
    render(<PostCard post={mockPost} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/posts/post-1");
  });

  it("renders no tags section when tags array is empty", () => {
    const postNoTags: Post = { ...mockPost, tags: [] };
    render(<PostCard post={postNoTags} />);
    expect(screen.queryByText("react")).not.toBeInTheDocument();
  });

  it("opens edit modal when edit button is clicked", () => {
    render(<PostCard post={mockPost} />);
    const editBtn = screen.getByTitle("Edit post");
    fireEvent.click(editBtn);
    const { modalType, targetPostId } = useModalStore.getState();
    expect(modalType).toBe("edit");
    expect(targetPostId).toBe("post-1");
  });

  it("opens delete modal when delete button is clicked", () => {
    render(<PostCard post={mockPost} />);
    const deleteBtn = screen.getByTitle("Delete post");
    fireEvent.click(deleteBtn);
    const { modalType, targetPostId } = useModalStore.getState();
    expect(modalType).toBe("delete");
    expect(targetPostId).toBe("post-1");
  });
});
