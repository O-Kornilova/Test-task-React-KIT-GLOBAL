import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { fetcher, SWR_KEYS } from '@/lib/fetchers'
import { useToastStore, useModalStore } from '@/store'
import { useAppDispatch } from '@/store/hooks'
import { clearPosts } from '@/store/postsSlice'
import { useRouter } from 'next/navigation'
import type { Post, CreatePostInput, UpdatePostInput } from '@/types'
import type { PostFormOutput } from '@/schemas'

export function usePosts () {
  return useSWR<Post[]>(SWR_KEYS.posts, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })
}

export function usePost (id: string) {
  return useSWR<Post>(id ? SWR_KEYS.post(id) : null, fetcher, {
    revalidateOnFocus: false,
  })
}

export function useCreatePost () {
  const addToast = useToastStore(s => s.addToast)
  const closeModal = useModalStore(s => s.closeModal)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { trigger, isMutating } = useSWRMutation(
    SWR_KEYS.posts,
    async (url: string, { arg }: { arg: CreatePostInput }) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
      })
      if (!res.ok) throw new Error('Failed to create post')
      return res.json() as Promise<Post>
    },
    {
      onSuccess: async () => {
        addToast('success', 'Post created successfully!')
        closeModal()
        dispatch(clearPosts()) // clear Redux → PostList uses fresh SSR data
        router.refresh()
      },
      onError: () => {
        addToast('error', 'Failed to create post. Please try again.')
      },
    }
  )

  const create = async (data: PostFormOutput) => {
    await trigger({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      author: data.author,
      tags: data.tags,
    })
  }

  return { create, isMutating }
}

export function useUpdatePost (id: string) {
  const addToast = useToastStore(s => s.addToast)
  const closeModal = useModalStore(s => s.closeModal)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { trigger, isMutating } = useSWRMutation(
    `update-post-${id}`,
    async (_url: string, { arg }: { arg: { id: string; data: UpdatePostInput } }) => {
      const res = await fetch(`/api/posts/${arg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg.data),
      })
      if (!res.ok) throw new Error('Failed to update post')
      return res.json() as Promise<Post>
    },
    {
      onSuccess: async () => {
        addToast('success', 'Post updated successfully!')
        closeModal()
        dispatch(clearPosts()) // clear Redux → PostList uses fresh SSR data
        router.refresh()
      },
      onError: () => {
        addToast('error', 'Failed to update post.')
      },
    }
  )

  const update = async (data: PostFormOutput) => {
    await trigger({ id, data })
  }

  return { update, isMutating }
}

export function useDeletePost () {
  const addToast = useToastStore(s => s.addToast)
  const closeModal = useModalStore(s => s.closeModal)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { trigger, isMutating } = useSWRMutation(
    'delete-post',
    async (_url: string, { arg }: { arg: { id: string } }) => {
      const res = await fetch(`/api/posts/${arg.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete post')
    },
    {
      onSuccess: async () => {
        addToast('success', 'Post deleted.')
        closeModal()
        dispatch(clearPosts()) // clear Redux → PostList uses fresh SSR data
        router.refresh()
      },
      onError: () => {
        addToast('error', 'Failed to delete post.')
      },
    }
  )

  const remove = async (id: string) => {
    await trigger({ id })
  }

  return { remove, isMutating }
}
