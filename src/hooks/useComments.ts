import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { fetcher, SWR_KEYS } from "@/lib/fetchers";
import { useToastStore } from "@/store";
import type { Comment, CreateCommentInput } from "@/types";
import type { CommentFormValues } from "@/schemas";

// ─── Fetch Comments ────────────────────────────────────────────────────────

export function useComments(postId: string) {
  return useSWR<Comment[]>(
    postId ? SWR_KEYS.comments(postId) : null,
    fetcher,
    { revalidateOnFocus: false }
  );
}

// ─── Create Comment ────────────────────────────────────────────────────────

async function createCommentFetcher(
  url: string,
  { arg }: { arg: CreateCommentInput }
) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });
  if (!res.ok) throw new Error("Failed to post comment");
  return res.json() as Promise<Comment>;
}

export function useCreateComment(postId: string) {
  const addToast = useToastStore((s) => s.addToast);

  const { trigger, isMutating } = useSWRMutation(
    SWR_KEYS.comments(postId),
    createCommentFetcher,
    {
      onSuccess: () => {
        addToast("success", "Comment posted!");
        mutate(SWR_KEYS.comments(postId));
        mutate(SWR_KEYS.post(postId));
        mutate(SWR_KEYS.posts);
      },
      onError: () => {
        addToast("error", "Failed to post comment.");
      },
    }
  );

  const post = async (data: CommentFormValues) => {
    await trigger({ postId, ...data });
  };

  return { post, isMutating };
}

// ─── Delete Comment ────────────────────────────────────────────────────────

async function deleteCommentFetcher(
  _url: string,
  { arg }: { arg: { commentId: string; postId: string } }
) {
  const res = await fetch(
    `/api/posts/${arg.postId}/comments?commentId=${arg.commentId}`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error("Failed to delete comment");
}

export function useDeleteComment(postId: string) {
  const addToast = useToastStore((s) => s.addToast);

  const { trigger, isMutating } = useSWRMutation(
    `delete-comment-${postId}`,
    deleteCommentFetcher,
    {
      onSuccess: () => {
        addToast("success", "Comment removed.");
        mutate(SWR_KEYS.comments(postId));
        mutate(SWR_KEYS.post(postId));
        mutate(SWR_KEYS.posts);
      },
      onError: () => {
        addToast("error", "Failed to delete comment.");
      },
    }
  );

  const remove = async (commentId: string) => {
    await trigger({ commentId, postId });
  };

  return { remove, isMutating };
}
