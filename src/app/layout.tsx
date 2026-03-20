import type { Metadata } from 'next'
import './globals.css'
import { SWRProvider } from '@/components/layout/SWRProvider'
import { ToastContainer } from '@/components/ui/ToastContainer'
import { ReduxProvider } from '@/components/layout/ReduxProvider'

export const metadata: Metadata = {
  title: {
    default: 'Inkwell — A Thoughtful Blog',
    template: '%s | Inkwell'
  },
  description: 'A modern blog built with Next.js 15, SWR, Zustand, Redux Toolkit, and Firebase.',
  keywords: ['blog', 'next.js', 'react', 'typescript', 'redux']
}

export default function RootLayout ({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className='min-h-screen bg-paper text-ink'>
        <ReduxProvider>
          <SWRProvider>
            {children}
            <ToastContainer />
          </SWRProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
