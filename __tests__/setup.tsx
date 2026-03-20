import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  notFound: vi.fn(),
}));

// Mock Next.js Link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock Firebase — tests never hit Firestore
vi.mock("@/lib/firebase", () => ({
  db: {},
  default: {},
}));

vi.mock("@/lib/firestore", () => ({
  fetchPosts: vi.fn().mockResolvedValue([]),
  fetchPostById: vi.fn().mockResolvedValue(null),
  createPost: vi.fn(),
  updatePost: vi.fn(),
  deletePost: vi.fn(),
  fetchComments: vi.fn().mockResolvedValue([]),
  createComment: vi.fn(),
  deleteComment: vi.fn(),
}));
