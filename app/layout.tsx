import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './providers/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

// Get basePath for manifest (respects GitHub Pages basePath)
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.NODE_ENV === 'production' ? '/profile' : '')
const manifestPath = `${basePath}/manifest.json`

export const metadata: Metadata = {
  title: 'Profile | Parkpoom Wisedsri (ภาคภูมิ วิเศษศรี)',
  description:
    'Portfolio website of Parkpoom Wisedsri (ภาคภูมิ วิเศษศรี) highlighting data analytics and telehealth visualization work.',
  keywords: [
    'Parkpoom Wisedsri',
    'ภาคภูมิ วิเศษศรี',
    'Portfolio',
    'Data Analytics',
    'Telehealth',
    'Visualization',
  ],
  manifest: manifestPath,
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  openGraph: {
    title: 'Parkpoom Wisedsri | Portfolio (ภาคภูมิ วิเศษศรี)',
    description:
      'พอร์ตโฟลิโอของ ภาคภูมิ วิเศษศรี (Parkpoom Wisedsri) รวมประสบการณ์ งานวิจัย และผลงานด้าน Data Analytics และ Telehealth Visualization.',
    siteName: 'Parkpoom Wisedsri Portfolio',
    locale: 'th_TH',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Parkpoom Wisedsri | Portfolio (ภาคภูมิ วิเศษศรี)',
    description:
      'Portfolio ของ ภาคภูมิ วิเศษศรี (Parkpoom Wisedsri) ครอบคลุมงาน Data Analytics และ Telehealth Visualization.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-full flex flex-col pt-4 sm:pt-6 md:pt-10 px-4 sm:px-5 md:px-6`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
