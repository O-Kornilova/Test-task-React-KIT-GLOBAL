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
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,500;1,8..60,300;1,8..60,400&family=JetBrains+Mono:wght@400;500&display=swap'
          rel='stylesheet'
        />
      </head>
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
