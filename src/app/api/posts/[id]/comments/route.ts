import { NextResponse } from "next/server";
import { fetchComments, createComment, deleteComment } from "@/lib/firestore";
import { commentSchema } from "@/schemas";
import { ZodError } from "zod";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  try {
    const comments = await fetchComments(id);
    return NextResponse.json(comments);
  } catch (error) {
    console.error(`[GET /api/posts/${id}/comments]`, error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Params) {
  const { id: postId } = await params;
  try {
    const body = await request.json();
    const validated = commentSchema.parse(body);
    const comment = await createComment({ postId, ...validated });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 422 }
      );
    }
    console.error(`[POST /api/posts/${postId}/comments]`, error);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { id: postId } = await params;
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get("commentId");
  if (!commentId) {
    return NextResponse.json({ error: "commentId is required" }, { status: 400 });
  }
  try {
    await deleteComment(commentId, postId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[DELETE /api/posts/${postId}/comments]`, error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
