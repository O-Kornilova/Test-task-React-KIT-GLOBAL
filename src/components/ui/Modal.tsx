'use client'
import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useModalStore } from '@/store'

interface ModalProps {
  title: string
  children: React.ReactNode
  wide?: boolean
}

export function Modal ({ title, children, wide = false }: ModalProps) {
  const closeModal = useModalStore(s => s.closeModal)
  const backdropRef = useRef<HTMLDivElement>(null)
  const mouseDownTarget = useRef<EventTarget | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [closeModal])

  return (
    <div
      ref={backdropRef}
      onMouseDown={e => {
        mouseDownTarget.current = e.target
      }}
      onClick={e => {
        if (e.target === backdropRef.current && mouseDownTarget.current === backdropRef.current) {
          closeModal()
        }
      }}
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in'
      role='dialog'
      aria-modal='true'
    >
      <div
        className={`animate-scale-in bg-paper-soft border border-border rounded-sm shadow-modal w-full flex flex-col max-h-[90vh] ${
          wide ? 'max-w-2xl' : 'max-w-lg'
        }`}
      >
        <div className='flex items-center justify-between px-6 py-4 border-b border-border shrink-0'>
          <h2
            className='text-lg font-semibold text-ink'
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h2>
          <button
            onClick={closeModal}
            className='text-muted hover:text-ink transition-colors p-1 rounded'
            aria-label='Close modal'
          >
            <X size={18} />
          </button>
        </div>

        <div className='overflow-y-auto flex-1 px-6 py-5'>{children}</div>
      </div>
    </div>
  )
}
