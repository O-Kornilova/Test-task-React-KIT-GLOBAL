"use client";
import { useMemo } from "react";
import { usePosts } from "@/hooks/usePosts";
import { useFilterStore, useModalStore } from "@/store";
import { PostCard } from "./PostCard";
import { PostCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "./FilterBar";
import type { Post } from "@/types";

export function PostList({ initialPosts }: { initialPosts?: Post[] }) {
  const { data: posts, isLoading } = usePosts();
  const { filters } = useFilterStore();
  const openModal = useModalStore((s) => s.openModal);

  const allPosts = posts ?? initialPosts ?? [];

  const filtered = useMemo(() => {
    let result = [...allPosts];

    // Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    // Tag filter
    if (filters.tag) {
      result = result.filter((p) => p.tags.includes(filters.tag));
    }

    // Sort
    result.sort((a, b) => {
      let valA: string | number = a[filters.sortBy];
      let valB: string | number = b[filters.sortBy];
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return filters.sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return filters.sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [allPosts, filters]);

  // Collect all unique tags for the tag filter
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    allPosts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [allPosts]);

  return (
    <section>
      <FilterBar allTags={allTags} />

      {isLoading && !initialPosts?.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={filters.search || filters.tag ? "No matching posts" : "No posts yet"}
          description={
            filters.search || filters.tag
              ? "Try a different search term or tag."
              : "Share your first thought with the world."
          }
          action={
            !filters.search && !filters.tag ? (
              <button onClick={() => openModal("create")} className="btn-primary">
                Write a Post
              </button>
            ) : undefined
          }
        />
      ) : (
        <>
          <p className="text-xs text-muted mb-4 mt-6" style={{ fontFamily: "var(--font-body)" }}>
            {filtered.length} {filtered.length === 1 ? "post" : "posts"}
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {filtered.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
