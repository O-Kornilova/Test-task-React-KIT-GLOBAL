import { NextResponse } from 'next/server'
import { fetchPosts, createPost } from '@/lib/firestore'
import { postSchema } from '@/schemas'
import { z, ZodError } from 'zod'

// Server receives tags already as array (transformed by client Zod)
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

export async function GET () {
  try {
    const posts = await fetchPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error('[GET /api/posts]', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST (request: Request) {
  try {
    const body = await request.json()
    const validated = postServerSchema.parse(body)
    const post = await createPost(validated)
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 422 }
      )
    }
    console.error('[POST /api/posts]', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
