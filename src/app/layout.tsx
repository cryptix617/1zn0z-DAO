import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const Web3ProviderClient = dynamic(() => import('../contexts/Web3Context').then((mod) => mod.Web3Provider), {
  ssr: false,
})

export const metadata: Metadata = {
  title: '1zn0z DAO',
  description: 'Decentralized Collaboration Platform',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3ProviderClient>
          {children}
        </Web3ProviderClient>
      </body>
    </html>
  )
}
