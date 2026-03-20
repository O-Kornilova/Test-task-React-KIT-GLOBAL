"use client";
import { Pencil, Trash2 } from "lucide-react";
import { useModalStore } from "@/store";

export function PostDetailActions({ postId }: { postId: string }) {
  const openModal = useModalStore((s) => s.openModal);
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => openModal("edit", postId)}
        className="btn-ghost text-xs py-1.5"
        title="Edit post"
      >
        <Pencil size={13} />
        Edit
      </button>
      <button
        onClick={() => openModal("delete", postId)}
        className="btn-ghost text-xs py-1.5 hover:border-danger/40 hover:text-danger"
        title="Delete post"
      >
        <Trash2 size={13} />
        Delete
      </button>
    </div>
  );
}
