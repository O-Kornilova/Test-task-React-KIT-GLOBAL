export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string[];
  createdAt: string; // ISO string (serializable for SSR)
  updatedAt: string;
  commentCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
}

export type PostSortKey = "createdAt" | "title" | "commentCount";
export type SortOrder = "asc" | "desc";

export interface PostFilters {
  search: string;
  tag: string;
  sortBy: PostSortKey;
  sortOrder: SortOrder;
}

export type CreatePostInput = Omit<Post, "id" | "createdAt" | "updatedAt" | "commentCount">;
export type UpdatePostInput = Partial<CreatePostInput>;
export type CreateCommentInput = Omit<Comment, "id" | "createdAt">;
