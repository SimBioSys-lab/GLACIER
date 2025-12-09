import localFont from 'next/font/local'
import { Inter } from 'next/font/google'

// Load VT323 Font
export const vt323Font = localFont({
  src: '../public/fonts/VT323-Regular.ttf',
  variable: '--font-vt323',
  display: 'swap',
})

// Load Nothing Font 5x7 (keeping for backwards compatibility)
export const nothingFont = localFont({
  src: '../public/fonts/nothing-font-5x7.otf',
  variable: '--font-nothing',
  display: 'swap',
})

// Load Inter as fallback
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})
