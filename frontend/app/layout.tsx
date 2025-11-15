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

// Load Nothing Font 5x7
const nothingFont = localFont({
  src: "../public/fonts/nothing-font-5x7.otf",
  variable: "--font-nothing",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GLACIER - SimBioSys Lab Initiative",
  description: "Computational biology platform for glycoprotein structure analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nothingFont.variable}>
      <body
        className={`${nothingFont.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ fontFamily: 'var(--font-nothing), monospace' }}
      >
        <BackendHealthCheck />
        {children}
      </body>
    </html>
  );
}
