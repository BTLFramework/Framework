import type { Metadata } from 'next'
import './globals.css'
import { SWRProvider } from '@/components/SWRProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export const metadata: Metadata = {
  title: 'Back to Life - Patient Portal',
  description: 'Your personalized recovery journey',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <SWRProvider>
            {children}
          </SWRProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
