"use client";
import { useFilterStore } from "@/store";
import { Search, X, SlidersHorizontal } from "lucide-react";
import type { PostSortKey, SortOrder } from "@/types";

interface FilterBarProps {
  allTags: string[];
}

export function FilterBar({ allTags }: FilterBarProps) {
  const { filters, setFilter, resetFilters } = useFilterStore();
  const hasActiveFilters = filters.search || filters.tag;

  const sortOptions: { label: string; value: PostSortKey }[] = [
    { label: "Date", value: "createdAt" },
    { label: "Title", value: "title" },
    { label: "Comments", value: "commentCount" },
  ];

  const orderOptions: { label: string; value: SortOrder }[] = [
    { label: "↓ Desc", value: "desc" },
    { label: "↑ Asc", value: "asc" },
  ];

  return (
    <div className="flex flex-col gap-4 mt-8 mb-2">
      {/* Search row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            placeholder="Search posts, authors, tags…"
            className="field-input pl-9 pr-9"
          />
          {filters.search && (
            <button
              onClick={() => setFilter("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort by */}
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal size={14} className="text-muted" />
          <select
            value={filters.sortBy}
            onChange={(e) => setFilter("sortBy", e.target.value as PostSortKey)}
            className="field-input py-2 text-sm w-auto pr-8"
            style={{ minWidth: "100px" }}
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <select
            value={filters.sortOrder}
            onChange={(e) => setFilter("sortOrder", e.target.value as SortOrder)}
            className="field-input py-2 text-sm w-auto pr-8"
            style={{ minWidth: "80px" }}
          >
            {orderOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags row */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-muted mr-1" style={{ fontFamily: "var(--font-body)" }}>
            Filter:
          </span>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter("tag", filters.tag === tag ? "" : tag)}
              className={`tag-pill ${filters.tag === tag ? "active" : ""}`}
            >
              {tag}
            </button>
          ))}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-danger underline underline-offset-2 ml-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}
