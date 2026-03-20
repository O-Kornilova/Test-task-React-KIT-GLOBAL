# Inkwell — KIT GLOBAL Test Assignment

A full-featured single-page blog application built with **Next.js 15 (App Router + SSR)**, **TypeScript**, **SWR + Zustand**, **Zod**, and **Firebase Firestore**.

---

## Live Features

| Feature | Details |
|---|---|
| **Post list** | SSR-rendered on first load, client-hydrated via SWR |
| **Create post** | Modal form with full Zod validation |
| **Edit post** | Pre-filled modal, optimistic SWR revalidation |
| **Delete post** | Confirmation modal, cascading comment deletion |
| **Post detail** | Server-rendered page with full content |
| **Comments** | Add / delete per-post comments, count synced in real time |
| **Filter & Search** | Live search by title / author / tag, tag-pill filter |
| **Sort** | By date, title, or comment count — ascending or descending |
| **Responsive** | Mobile-first layout, works on all screen sizes |
| **Toast system** | Success / error / info notifications via Zustand |

---

## Tech Stack

```
Next.js 15          — App Router, SSR, API Routes
TypeScript          — strict mode throughout
SWR 2              — data fetching, caching, mutation hooks
Zustand 5          — UI state (filters, modals, toasts)
Zod 3              — schema validation on forms AND API routes
React Hook Form    — performant forms, integrated with Zod via @hookform/resolvers
Firebase Firestore — cloud NoSQL database
Tailwind CSS 3     — utility-first styling
Vitest + RTL       — unit & component tests
```

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── posts/
│   │       ├── route.ts              # GET /api/posts, POST /api/posts
│   │       └── [id]/
│   │           ├── route.ts          # GET / PATCH / DELETE /api/posts/:id
│   │           └── comments/
│   │               └── route.ts      # GET / POST / DELETE comments
│   ├── posts/
│   │   └── [id]/
│   │       ├── page.tsx              # SSR post detail page
│   │       └── PostDetailActions.tsx # Client edit/delete buttons
│   ├── layout.tsx                    # Root layout, SWR provider
│   ├── page.tsx                      # SSR home page (post list)
│   ├── not-found.tsx                 # 404 page
│   └── globals.css                   # Design system, animations
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── SWRProvider.tsx
│   ├── posts/
│   │   ├── PostCard.tsx              # Individual post card
│   │   ├── PostList.tsx              # Filtered/sorted grid
│   │   ├── PostForm.tsx              # Create/edit form (Zod + RHF)
│   │   ├── FilterBar.tsx             # Search, tag, sort controls
│   │   └── ModalController.tsx       # Orchestrates all modals
│   ├── comments/
│   │   ├── CommentList.tsx
│   │   └── CommentForm.tsx
│   └── ui/
│       ├── Modal.tsx                 # Generic modal wrapper
│       ├── Field.tsx                 # Input / textarea with error
│       ├── Skeleton.tsx              # Loading skeletons
│       ├── EmptyState.tsx
│       └── ToastContainer.tsx
│
├── hooks/
│   ├── usePosts.ts                   # SWR hooks: usePosts, usePost, useCreatePost…
│   └── useComments.ts                # SWR hooks: useComments, useCreateComment…
│
├── store/
│   └── index.ts                      # Zustand: useFilterStore, useModalStore, useToastStore
│
├── lib/
│   ├── firebase.ts                   # Firebase app init
│   ├── firestore.ts                  # Firestore CRUD helpers
│   └── fetchers.ts                   # SWR fetcher + key constants
│
├── schemas/
│   └── index.ts                      # Zod schemas: postSchema, commentSchema, filterSchema
│
└── types/
    └── index.ts                      # Shared TypeScript interfaces

__tests__/
├── setup.ts                          # Vitest + Testing Library setup, Firebase mock
├── schemas.test.ts                   # Zod schema unit tests
├── store.test.ts                     # Zustand store unit tests
├── PostCard.test.tsx                 # PostCard component tests
├── PostForm.test.tsx                 # PostForm component tests
└── firestore.test.ts                 # Firestore helper tests (mocked)
```

---

## Architecture Decisions

### SSR + SWR (hybrid)
The home page and post detail pages are **server-rendered** with Next.js `async` page components that fetch Firestore data directly. The SSR data is passed as `initialPosts` to the `<PostList>` client component, which uses **SWR for subsequent mutations and revalidations**. This gives fast initial page loads with up-to-date client state after any write.

### SWR for mutations
`useSWRMutation` is used for create / update / delete operations. Each mutation's `onSuccess` handler calls `mutate()` to revalidate related keys — keeping the UI consistent without manual state management.

### Zustand for UI state
Three lightweight stores handle non-server state:
- `useFilterStore` — search query, tag filter, sort key/order
- `useModalStore` — which modal is open and the target post id
- `useToastStore` — transient notification queue with auto-dismiss

### Zod on both ends
Schemas in `src/schemas/index.ts` are shared between the **React Hook Form resolver** (client) and the **Next.js API route handlers** (server), ensuring the same rules apply everywhere.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/kit-global-blog.git
cd kit-global-blog
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com), then:

1. Enable **Firestore Database** (start in test mode for development)
2. Go to **Project Settings → General → Your apps** → add a Web app
3. Copy your config values into `.env.local`:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 4. Add Firestore indexes

In the Firebase console, add a **composite index** for comments:

| Collection | Fields | Order |
|---|---|---|
| `comments` | `postId` (ASC), `createdAt` (ASC) | — |

### 5. Run the dev server

```bash
npm run dev
# → http://localhost:3000
```

---

## Available Scripts

```bash
npm run dev        # Start Next.js in development mode
npm run build      # Production build
npm run start      # Serve production build
npm run lint       # ESLint
npm run test       # Run all Vitest tests once
npm run test:watch # Watch mode
```

---

## Running Tests

Tests are colocated in `__tests__/`. Firebase is fully mocked — no credentials needed.

```bash
npm run test
```

**Test coverage:**
- `schemas.test.ts` — 15 cases covering all Zod schemas including edge cases
- `store.test.ts`   — 16 cases for all three Zustand stores
- `PostCard.test.tsx` — 9 component tests including modal interactions
- `PostForm.test.tsx` — 7 tests including validation and pre-fill
- `firestore.test.ts` — 5 tests for Firestore helper contracts

---

## Deployment (Vercel)

```bash
vercel deploy
```

Add all `NEXT_PUBLIC_FIREBASE_*` environment variables in the Vercel project dashboard under **Settings → Environment Variables**.

---

## Firestore Data Model

```
posts/{postId}
  title:        string
  content:      string
  excerpt:      string
  author:       string
  tags:         string[]
  commentCount: number
  createdAt:    Timestamp
  updatedAt:    Timestamp

comments/{commentId}
  postId:    string  (reference to posts/{postId})
  author:    string
  content:   string
  createdAt: Timestamp
```
