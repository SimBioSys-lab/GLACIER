import localFont from 'next/font/local'
import { Inter } from 'next/font/google'

// Load Nothing Font 5x7
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
