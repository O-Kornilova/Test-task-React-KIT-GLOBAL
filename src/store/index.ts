import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { PostFilters } from '@/types'

// ─── UI / Filter State ───────────────────────────────────────────────────────

interface FilterState {
  filters: PostFilters
  setFilter: <K extends keyof PostFilters>(key: K, value: PostFilters[K]) => void
  resetFilters: () => void
}

const defaultFilters: PostFilters = {
  search: '',
  tag: '',
  sortBy: 'createdAt',
  sortOrder: 'desc'
}

export const useFilterStore = create<FilterState>()(
  devtools(
    set => ({
      filters: defaultFilters,
      setFilter: (key, value) =>
        set(state => ({
          filters: { ...state.filters, [key]: value }
        })),
      resetFilters: () => set({ filters: defaultFilters })
    }),
    { name: 'filter-store' }
  )
)

// ─── Modal / Dialog State ─────────────────────────────────────────────────────

type ModalType = 'create' | 'edit' | 'delete' | null

interface ModalState {
  modalType: ModalType
  targetPostId: string | null
  openModal: (type: Exclude<ModalType, null>, postId?: string) => void
  closeModal: () => void
}

export const useModalStore = create<ModalState>()(
  devtools(
    set => ({
      modalType: null,
      targetPostId: undefined,
      openModal: (type, postId = undefined) => set({ modalType: type, targetPostId: postId }),
      closeModal: () => set({ modalType: null, targetPostId: null })
    }),
    { name: 'modal-store' }
  )
)

// ─── Notification / Toast State ───────────────────────────────────────────────

type ToastKind = 'success' | 'error' | 'info'

interface Toast {
  id: string
  kind: ToastKind
  message: string
}

interface ToastState {
  toasts: Toast[]
  addToast: (kind: ToastKind, message: string) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>()(
  devtools(
    set => ({
      toasts: [],
      addToast: (kind, message) => {
        const id = `${Date.now()}-${Math.random()}`
        set(state => ({ toasts: [...state.toasts, { id, kind, message }] }))
        // Auto-remove after 4s
        setTimeout(() => {
          set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }))
        }, 4000)
      },
      removeToast: id => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }))
    }),
    { name: 'toast-store' }
  )
)
