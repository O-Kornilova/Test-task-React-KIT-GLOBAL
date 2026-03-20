import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PostForm } from '@/components/posts/PostForm'

const validData = {
  title: 'My Test Post Title',
  author: 'Test Author',
  excerpt: 'A compelling excerpt for the post.',
  content: 'This is the full content of the post. It is long enough to pass validation.',
  tags: 'react, testing'
}

describe('PostForm', () => {
  it('renders all form fields', () => {
    render(<PostForm onSubmit={vi.fn()} isMutating={false} />)
    expect(screen.getByPlaceholderText(/what's your post about/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/short teaser/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/write your post/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/react, typescript/i)).toBeInTheDocument()
  })

  it('renders the submit button with default label', () => {
    render(<PostForm onSubmit={vi.fn()} isMutating={false} />)
    expect(screen.getByRole('button', { name: /publish post/i })).toBeInTheDocument()
  })

  it('renders a custom submit label', () => {
    render(<PostForm onSubmit={vi.fn()} isMutating={false} submitLabel='Save Changes' />)
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
  })

  it('disables submit button while mutating', () => {
    render(<PostForm onSubmit={vi.fn()} isMutating={true} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows validation errors on submit with empty fields', async () => {
    const user = userEvent.setup()
    render(<PostForm onSubmit={vi.fn()} isMutating={false} />)
    await user.click(screen.getByRole('button', { name: /publish post/i }))
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    })
  })

  it('calls onSubmit when form is valid', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<PostForm onSubmit={onSubmit} isMutating={false} />)

    await user.type(screen.getByPlaceholderText(/what's your post about/i), validData.title)
    await user.type(screen.getByPlaceholderText(/your name/i), validData.author)
    await user.type(screen.getByPlaceholderText(/short teaser/i), validData.excerpt)
    await user.type(screen.getByPlaceholderText(/write your post/i), validData.content)
    await user.type(screen.getByPlaceholderText(/react, typescript/i), validData.tags)
    await user.click(screen.getByRole('button', { name: /publish post/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
  })

  it('pre-fills fields when a post prop is provided', () => {
    const existingPost = {
      id: 'post-1',
      title: 'Existing Title',
      author: 'Existing Author',
      excerpt: 'Existing excerpt here.',
      content: 'Existing content that is long enough.',
      tags: ['react', 'vitest'],
      commentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    render(<PostForm onSubmit={vi.fn()} isMutating={false} post={existingPost} />)
    expect(screen.getByPlaceholderText<HTMLInputElement>(/what's your post about/i).value).toBe(
      'Existing Title'
    )
    expect(screen.getByPlaceholderText<HTMLInputElement>(/your name/i).value).toBe(
      'Existing Author'
    )
  })
})
