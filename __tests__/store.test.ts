import { describe, it, expect, beforeEach, vi } from "vitest";
import { act } from "react";
import { useFilterStore, useModalStore, useToastStore } from "@/store";

// ─── FilterStore ──────────────────────────────────────────────────────────────

describe("useFilterStore", () => {
  beforeEach(() => {
    // Reset to initial state before each test
    useFilterStore.setState({
      filters: {
        search: "",
        tag: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    });
  });

  it("has correct default filter state", () => {
    const { filters } = useFilterStore.getState();
    expect(filters.search).toBe("");
    expect(filters.tag).toBe("");
    expect(filters.sortBy).toBe("createdAt");
    expect(filters.sortOrder).toBe("desc");
  });

  it("sets individual filter keys", () => {
    act(() => {
      useFilterStore.getState().setFilter("search", "react");
    });
    expect(useFilterStore.getState().filters.search).toBe("react");
  });

  it("does not mutate other filter keys when setting one", () => {
    act(() => {
      useFilterStore.getState().setFilter("tag", "typescript");
    });
    const { filters } = useFilterStore.getState();
    expect(filters.tag).toBe("typescript");
    expect(filters.search).toBe("");
    expect(filters.sortBy).toBe("createdAt");
  });

  it("resets all filters to defaults", () => {
    act(() => {
      useFilterStore.getState().setFilter("search", "something");
      useFilterStore.getState().setFilter("tag", "react");
      useFilterStore.getState().setFilter("sortBy", "title");
      useFilterStore.getState().resetFilters();
    });
    const { filters } = useFilterStore.getState();
    expect(filters.search).toBe("");
    expect(filters.tag).toBe("");
    expect(filters.sortBy).toBe("createdAt");
  });
});

// ─── ModalStore ───────────────────────────────────────────────────────────────

describe("useModalStore", () => {
  beforeEach(() => {
    useModalStore.setState({ modalType: null, targetPostId: null });
  });

  it("starts with no modal open", () => {
    expect(useModalStore.getState().modalType).toBeNull();
    expect(useModalStore.getState().targetPostId).toBeNull();
  });

  it("opens create modal without a postId", () => {
    act(() => {
      useModalStore.getState().openModal("create");
    });
    expect(useModalStore.getState().modalType).toBe("create");
    expect(useModalStore.getState().targetPostId).toBeNull();
  });

  it("opens edit modal with the provided postId", () => {
    act(() => {
      useModalStore.getState().openModal("edit", "post-abc");
    });
    expect(useModalStore.getState().modalType).toBe("edit");
    expect(useModalStore.getState().targetPostId).toBe("post-abc");
  });

  it("opens delete modal with the provided postId", () => {
    act(() => {
      useModalStore.getState().openModal("delete", "post-xyz");
    });
    expect(useModalStore.getState().modalType).toBe("delete");
    expect(useModalStore.getState().targetPostId).toBe("post-xyz");
  });

  it("closes the modal and clears targetPostId", () => {
    act(() => {
      useModalStore.getState().openModal("delete", "post-xyz");
      useModalStore.getState().closeModal();
    });
    expect(useModalStore.getState().modalType).toBeNull();
    expect(useModalStore.getState().targetPostId).toBeNull();
  });
});

// ─── ToastStore ───────────────────────────────────────────────────────────────

describe("useToastStore", () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
    vi.useFakeTimers();
  });

  it("starts with no toasts", () => {
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it("adds a toast with the correct kind and message", () => {
    act(() => {
      useToastStore.getState().addToast("success", "Post created!");
    });
    const { toasts } = useToastStore.getState();
    expect(toasts).toHaveLength(1);
    expect(toasts[0].kind).toBe("success");
    expect(toasts[0].message).toBe("Post created!");
    expect(toasts[0].id).toBeTruthy();
  });

  it("adds multiple toasts", () => {
    act(() => {
      useToastStore.getState().addToast("success", "Done");
      useToastStore.getState().addToast("error", "Oops");
    });
    expect(useToastStore.getState().toasts).toHaveLength(2);
  });

  it("removes a toast by id", () => {
    act(() => {
      useToastStore.getState().addToast("info", "FYI");
    });
    const id = useToastStore.getState().toasts[0].id;
    act(() => {
      useToastStore.getState().removeToast(id);
    });
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it("auto-removes toast after 4 seconds", () => {
    act(() => {
      useToastStore.getState().addToast("success", "Auto gone");
    });
    expect(useToastStore.getState().toasts).toHaveLength(1);
    act(() => {
      vi.advanceTimersByTime(4001);
    });
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
