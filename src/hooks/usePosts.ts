import useSWR, { mutate } from 'swr'
import useSWRMutation from 'swr/mutation'
import { fetcher, SWR_KEYS } from '@/lib/fetchers'
import { useToastStore, useModalStore } from '@/store'
import type { Post, CreatePostInput, UpdatePostInput } from '@/types'
import type { PostFormOutput } from '@/schemas'

// ─── Fetch All Posts ─────────────────────────────────────────────────────────

export function usePosts () {
  return useSWR<Post[]>(SWR_KEYS.posts, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true
  })
}

// ─── Fetch Single Post ────────────────────────────────────────────────────────

export function usePost (id: string) {
  return useSWR<Post>(id ? SWR_KEYS.post(id) : null, fetcher, {
    revalidateOnFocus: false
  })
}

// ─── Create Post ──────────────────────────────────────────────────────────────

async function createPostFetcher (url: string, { arg }: { arg: CreatePostInput }) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg)
  })
  if (!res.ok) throw new Error('Failed to create post')
  return res.json() as Promise<Post>
}

export function useCreatePost () {
  const addToast = useToastStore(s => s.addToast)
  const closeModal = useModalStore(s => s.closeModal)

  const { trigger, isMutating } = useSWRMutation(SWR_KEYS.posts, createPostFetcher, {
    onSuccess: async (newPost: Post) => {
      await mutate(SWR_KEYS.posts, (posts: Post[] = []) => [newPost, ...posts], {
        revalidate: false
      })
      addToast('success', 'Post created successfully!')
      closeModal()
    },
    onError: () => {
      addToast('error', 'Failed to create post. Please try again.')
    }
  })

  const create = async (data: PostFormOutput) => {
    await trigger({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      author: data.author,
      tags: data.tags
    })
  }

  return { create, isMutating }
}

// ─── Update Post ──────────────────────────────────────────────────────────────

async function updatePostFetcher (
  url: string,
  { arg }: { arg: { id: string; data: UpdatePostInput } }
) {
  const res = await fetch(`/api/posts/${arg.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg.data)
  })
  if (!res.ok) throw new Error('Failed to update post')
  return res.json() as Promise<Post>
}

export function useUpdatePost (id: string) {
  const addToast = useToastStore(s => s.addToast)
  const closeModal = useModalStore(s => s.closeModal)

  const { trigger, isMutating } = useSWRMutation(`update-post-${id}`, updatePostFetcher, {
    onSuccess: async (updatedPost: Post) => {
      await mutate(
        SWR_KEYS.posts,
        (posts: Post[] = []) => posts.map(p => (p.id === updatedPost.id ? updatedPost : p)),
        { revalidate: true }
      )
      await mutate(SWR_KEYS.post(updatedPost.id), updatedPost, { revalidate: false })
      closeModal()
      addToast('success', 'Post updated successfully!')
    },
    onError: () => {
      addToast('error', 'Failed to update post.')
    }
  })

  const update = async (data: PostFormOutput) => {
    await trigger({ id, data })
  }

  return { update, isMutating }
}

// ─── Delete Post ──────────────────────────────────────────────────────────────

async function deletePostFetcher (url: string, { arg }: { arg: { id: string } }) {
  const res = await fetch(`/api/posts/${arg.id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete post')
}

export function useDeletePost () {
  const addToast = useToastStore(s => s.addToast)
  const closeModal = useModalStore(s => s.closeModal)
  let deletedId = ''

  const { trigger, isMutating } = useSWRMutation('delete-post', deletePostFetcher, {
    onSuccess: async () => {
      await mutate(SWR_KEYS.posts, (posts: Post[] = []) => posts.filter(p => p.id !== deletedId), {
        revalidate: false
      })
      addToast('success', 'Post deleted.')
      closeModal()
    },
    onError: () => {
      addToast('error', 'Failed to delete post.')
    }
  })

  const remove = async (id: string) => {
    deletedId = id
    await trigger({ id })
  }

  return { remove, isMutating }
}
