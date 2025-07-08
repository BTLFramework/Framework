import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
