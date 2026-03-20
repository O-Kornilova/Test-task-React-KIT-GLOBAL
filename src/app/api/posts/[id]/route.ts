import { NextResponse } from 'next/server'
import { fetchPostById, updatePost, deletePost } from '@/lib/firestore'
import { postSchema } from '@/schemas'
import { z, ZodError } from 'zod'
import { revalidatePath } from 'next/cache'

const postServerSchema = postSchema.extend({
  tags: z.union([
    z.array(z.string()),
    z.string().transform(val =>
      val
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean)
    )
  ])
})

interface Params {
  params: Promise<{ id: string }>
}

export async function GET (_req: Request, { params }: Params) {
  const { id } = await params
  try {
    const post = await fetchPostById(id)
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(post)
  } catch (error) {
    console.error(`[GET /api/posts/${id}]`, error)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function PATCH (request: Request, { params }: Params) {
  const { id } = await params
  try {
    const body = await request.json()
    const validated = postServerSchema.partial().parse(body)
    const post = await updatePost(id, validated)
    revalidatePath('/')
    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 422 }
      )
    }
    console.error(`[PATCH /api/posts/${id}]`, error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE (_req: Request, { params }: Params) {
  const { id } = await params
  try {
    await deletePost(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`[DELETE /api/posts/${id}]`, error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
