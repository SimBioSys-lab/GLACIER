import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { BackendHealthCheck } from "@/components/BackendHealthCheck";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Load VT323 Font
const vt323Font = localFont({
  src: "../public/fonts/VT323-Regular.ttf",
  variable: "--font-vt323",
  weight: "400",
  display: "swap",
});

// Load Nothing Font 5x7 (keeping for backwards compatibility)
const nothingFont = localFont({
  src: "../public/fonts/nothing-font-5x7.otf",
  variable: "--font-nothing",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GLACIER - SimBioSys Lab Initiative",
  description: "Computational biology platform for glycoprotein structure analysis",
  icons: {
    icon: "/assets/images/G-logo.png",
    shortcut: "/assets/images/G-logo.png",
    apple: "/assets/images/G-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${vt323Font.variable} ${nothingFont.variable}`}>
      <body
        className={`${geistSans.className} antialiased`}
      >
        <BackendHealthCheck />
        {children}
      </body>
    </html>
  );
}
