import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Post } from "@/types";

export const fetchPostsThunk = createAsyncThunk("posts/fetchAll", async () => {
  const res = await fetch("/api/posts");
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json() as Promise<Post[]>;
});

export const createPostThunk = createAsyncThunk(
  "posts/create",
  async (data: Omit<Post, "id" | "createdAt" | "updatedAt" | "commentCount">) => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create post");
    return res.json() as Promise<Post>;
  }
);

export const updatePostThunk = createAsyncThunk(
  "posts/update",
  async ({ id, data }: { id: string; data: Partial<Post> }) => {
    const res = await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update post");
    return res.json() as Promise<Post>;
  }
);

export const deletePostThunk = createAsyncThunk(
  "posts/delete",
  async (id: string) => {
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete post");
    return id;
  }
);

interface PostsState {
  items: Post[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PostsState = {
  items: [],
  status: "idle",
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<Post[]>) {
      state.items = action.payload;
      state.status = "succeeded";
    },
    // Clear store so PostList falls back to fresh SSR initialPosts
    clearPosts(state) {
      state.items = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsThunk.pending, (state) => { state.status = "loading"; })
      .addCase(fetchPostsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchPostsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown error";
      })
      .addCase(createPostThunk.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updatePostThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deletePostThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export const { setPosts, clearPosts } = postsSlice.actions;
export default postsSlice.reducer;
