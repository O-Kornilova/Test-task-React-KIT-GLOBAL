'use client'
import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { setPosts } from '@/store/postsSlice'
import type { Post } from '@/types'

export function ReduxPostsInitializer ({ posts }: { posts: Post[] }) {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(setPosts(posts))
  }, [dispatch, posts])
  return null
}
