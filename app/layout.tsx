import React from "react"
import type { Metadata, Viewport } from 'next'

import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/auth-context'
import './globals.css'

import { Geist, Geist_Mono, Geist as V0_Font_Geist, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _geist = V0_Font_Geist({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200", "300", "400", "500", "600", "700", "800", "900"] })

import { connectToDatabase } from '@/lib/mongodb'
import type { Settings } from '@/lib/types'

export async function generateMetadata(): Promise<Metadata> {
  let settings: Settings | null = null;
  try {
    const { db } = await connectToDatabase();
    settings = await db.collection<Settings>('settings').findOne();
  } catch (error) {
    console.error('Failed to fetch settings for metadata:', error);
  }

  const companyName = settings?.companyName || 'Dimension Nepal';
  const tagline = settings?.tagline || 'Premier Construction Company';
  const favicon = settings?.favicon || '/icon.svg';

  return {
    title: {
      default: `${companyName} | ${tagline}`,
      template: `%s | ${companyName}`,
    },
    description: settings?.footerText || `${companyName} - Premier construction company delivering excellence in residential, commercial, and infrastructure projects across Nepal.`,
    keywords: ['construction', 'Nepal', 'building', 'contractor', 'residential', 'commercial', 'infrastructure'],
    icons: {
      icon: [
        {
          url: favicon,
        },
      ],
      apple: favicon,
    },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
