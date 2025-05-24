import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import HeaderActions from './HeaderActions'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Noah Site',
  description: 'Modern and Responsive Website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-8 py-2 md:py-4 bg-transparent">
          <div className="flex items-center">
            <Link href="/">
              <img src="/images/logo.png" alt="Logo" className="h-8 w-auto md:h-12 cursor-pointer" />
            </Link>
          </div>
          <HeaderActions />
        </header>
        <div className="pt-0">{children}</div>
      </body>
    </html>
  )
} 