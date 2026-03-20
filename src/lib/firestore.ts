import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  increment,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Post, Comment, CreatePostInput, UpdatePostInput, CreateCommentInput } from "@/types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function timestampToISO(ts: Timestamp | string | undefined): string {
  if (!ts) return new Date().toISOString();
  if (typeof ts === "string") return ts;
  return ts.toDate().toISOString();
}

// ─── Posts ───────────────────────────────────────────────────────────────────

const POSTS_COLLECTION = "posts";
const COMMENTS_COLLECTION = "comments";

export async function fetchPosts(): Promise<Post[]> {
  const q = query(collection(db, POSTS_COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      author: data.author,
      tags: data.tags ?? [],
      commentCount: data.commentCount ?? 0,
      createdAt: timestampToISO(data.createdAt),
      updatedAt: timestampToISO(data.updatedAt),
    } satisfies Post;
  });
}

export async function fetchPostById(id: string): Promise<Post | null> {
  const ref = doc(db, POSTS_COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    title: data.title,
    content: data.content,
    excerpt: data.excerpt,
    author: data.author,
    tags: data.tags ?? [],
    commentCount: data.commentCount ?? 0,
    createdAt: timestampToISO(data.createdAt),
    updatedAt: timestampToISO(data.updatedAt),
  };
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const now = serverTimestamp();
  const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
    ...input,
    commentCount: 0,
    createdAt: now,
    updatedAt: now,
  });
  // Re-fetch to get actual server timestamps
  const created = await fetchPostById(docRef.id);
  if (!created) throw new Error("Failed to create post");
  return created;
}

export async function updatePost(id: string, input: UpdatePostInput): Promise<Post> {
  const ref = doc(db, POSTS_COLLECTION, id);
  await updateDoc(ref, {
    ...input,
    updatedAt: serverTimestamp(),
  });
  const updated = await fetchPostById(id);
  if (!updated) throw new Error("Post not found after update");
  return updated;
}

export async function deletePost(id: string): Promise<void> {
  // Delete post document
  await deleteDoc(doc(db, POSTS_COLLECTION, id));
  // Also remove associated comments
  const commentsQ = query(
    collection(db, COMMENTS_COLLECTION),
    where("postId", "==", id)
  );
  const commentSnap = await getDocs(commentsQ);
  const deletions = commentSnap.docs.map((d) => deleteDoc(d.ref));
  await Promise.all(deletions);
}

// ─── Comments ────────────────────────────────────────────────────────────────

export async function fetchComments(postId: string): Promise<Comment[]> {
  const q = query(
    collection(db, COMMENTS_COLLECTION),
    where("postId", "==", postId),
    orderBy("createdAt", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      postId: data.postId,
      author: data.author,
      content: data.content,
      createdAt: timestampToISO(data.createdAt),
    } satisfies Comment;
  });
}

export async function createComment(input: CreateCommentInput): Promise<Comment> {
  const now = serverTimestamp();
  const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), {
    ...input,
    createdAt: now,
  });
  // Increment comment count on post
  await updateDoc(doc(db, POSTS_COLLECTION, input.postId), {
    commentCount: increment(1),
  });
  const snap = await getDoc(docRef);
  const data = snap.data()!;
  return {
    id: snap.id,
    postId: data.postId,
    author: data.author,
    content: data.content,
    createdAt: timestampToISO(data.createdAt),
  };
}

export async function deleteComment(commentId: string, postId: string): Promise<void> {
  await deleteDoc(doc(db, COMMENTS_COLLECTION, commentId));
  await updateDoc(doc(db, POSTS_COLLECTION, postId), {
    commentCount: increment(-1),
  });
}
