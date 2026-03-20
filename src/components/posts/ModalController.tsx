"use client";
import { useModalStore } from "@/store";
import { Modal } from "@/components/ui/Modal";
import { PostForm } from "@/components/posts/PostForm";
import { useCreatePost, useUpdatePost, useDeletePost, usePost } from "@/hooks/usePosts";
import { Loader2, AlertTriangle } from "lucide-react";
import type { PostFormValues } from "@/schemas";

// ─── Create ──────────────────────────────────────────────────────────────────

function CreatePostModal() {
  const { create, isMutating } = useCreatePost();
  return (
    <Modal title="New Post" wide>
      <PostForm
        onSubmit={create as (data: PostFormValues) => Promise<void>}
        isMutating={isMutating}
      />
    </Modal>
  );
}

// ─── Edit ─────────────────────────────────────────────────────────────────────

function EditPostModal({ postId }: { postId: string }) {
  const { data: post, isLoading } = usePost(postId);
  const { update, isMutating } = useUpdatePost(postId);

  if (isLoading)
    return (
      <Modal title="Edit Post" wide>
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-accent" size={28} />
        </div>
      </Modal>
    );

  return (
    <Modal title="Edit Post" wide>
      <PostForm
        post={post}
        onSubmit={update as (data: PostFormValues) => Promise<void>}
        isMutating={isMutating}
        submitLabel="Save Changes"
      />
    </Modal>
  );
}

// ─── Delete ───────────────────────────────────────────────────────────────────

function DeletePostModal({ postId }: { postId: string }) {
  const { remove, isMutating } = useDeletePost();
  const closeModal = useModalStore((s) => s.closeModal);

  return (
    <Modal title="Delete Post">
      <div className="flex flex-col items-center gap-5 py-4 text-center">
        <div className="w-14 h-14 rounded-full bg-danger/10 flex items-center justify-center">
          <AlertTriangle size={26} className="text-danger" />
        </div>
        <div>
          <p className="text-base font-semibold text-ink" style={{ fontFamily: "var(--font-display)" }}>
            Are you sure?
          </p>
          <p className="text-sm text-muted mt-1" style={{ fontFamily: "var(--font-body)" }}>
            This will permanently delete the post and all its comments.
          </p>
        </div>
        <div className="flex gap-3 w-full justify-center">
          <button onClick={closeModal} className="btn-ghost">
            Cancel
          </button>
          <button
            onClick={() => remove(postId)}
            disabled={isMutating}
            className="btn-danger min-w-[120px] justify-center"
          >
            {isMutating ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────

export function ModalController() {
  const { modalType, targetPostId } = useModalStore();

  if (!modalType) return null;
  if (modalType === "create") return <CreatePostModal />;
  if (!targetPostId) return null;
  if (modalType === "edit") return <EditPostModal postId={targetPostId} />;
  if (modalType === "delete") return <DeletePostModal postId={targetPostId} />;
  return null;
}
