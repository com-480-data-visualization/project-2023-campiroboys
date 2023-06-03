import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zurich Parking Spaces',
  description: 'Project of Data Visualization (COM-480)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <Analytics />
    </html>
  )
}
