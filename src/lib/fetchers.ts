// Generic SWR fetcher for API routes
export const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    throw error;
  }
  return res.json();
};

// SWR keys
export const SWR_KEYS = {
  posts: "/api/posts",
  post: (id: string) => `/api/posts/${id}`,
  comments: (postId: string) => `/api/posts/${postId}/comments`,
} as const;
