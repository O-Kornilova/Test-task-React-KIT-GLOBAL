import { fetchPosts } from '@/lib/firestore'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PostList } from '@/components/posts/PostList'
import { ModalController } from '@/components/posts/ModalController'
import { ReduxPostsInitializer } from '@/components/posts/ReduxPostsInitializer'
import type { Metadata } from 'next'
import type { Post } from '@/types'

export const metadata: Metadata = {
  title: 'Inkwell — Home'
}

export default async function HomePage () {
  let initialPosts: Post[] = []
  try {
    initialPosts = await fetchPosts()
  } catch {
    initialPosts = []
  }

  return (
    <>
      <Header />
      {/* Seed Redux store with SSR data */}
      <ReduxPostsInitializer posts={initialPosts} />

      <main className='max-w-5xl mx-auto px-4 sm:px-6 pb-12'>
        <section className='py-14 sm:py-20 text-center animate-fade-in'>
          <p
            className='text-accent text-3xl mb-3 select-none'
            style={{ fontFamily: 'var(--font-display)' }}
            aria-hidden
          >
            ✦ ✦ ✦
          </p>
          <h1
            className='text-4xl sm:text-5xl font-bold text-ink leading-tight mb-4'
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Inkwell
          </h1>
          <p
            className='text-muted text-lg max-w-md mx-auto leading-relaxed'
            style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic' }}
          >
            A thoughtful space for ideas, stories, and discoveries.
          </p>
          <div className='ornament mt-8 max-w-xs mx-auto' />
        </section>

        <PostList initialPosts={initialPosts} />
      </main>

      <Footer />
      <ModalController />
    </>
  )
}
