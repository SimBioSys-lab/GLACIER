"use client"

import React, { useState } from "react"
import Link from "next/link"
import SimplifiedGlassSurface from '../SimplifiedGlassSurface'

interface HeaderProps {
  onScrollToForm: () => void
}

export default function Header({ onScrollToForm }: HeaderProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="flex justify-center pt-6 px-4">
        <SimplifiedGlassSurface
          borderRadius={50}
          blur={10}
          opacity={0.5}
          className="pointer-events-auto max-w-7xl w-[85%]"
        >
          {/* Reduced padding (py-2) for a slimmer look */}
          <div className="grid grid-cols-3 items-center px-8 py-2 w-full">
            
            {/* LEFT: Anchor Text */}
            <div className="flex justify-start">
               <div className="flex flex-col leading-none">
                  <span className="text-[9px] uppercase tracking-[0.15em] text-black/40 font-sans font-semibold mb-1">
                    Initiative By
                  </span>
                  <span className="text-xs font-mono text-black/70">
                    SimBioSys
                  </span>
               </div>
            </div>

            {/* CENTER: The Hero Interaction */}
            <div className="flex justify-center">
              <Link href="/">
                <div 
                  className="relative flex flex-col items-center justify-center cursor-pointer min-w-[300px]"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className="text-center relative">
                    {isHovered ? (
                      <h5 
                        className="text-l font-mono text-black/70 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap transition-opacity duration-300"
                        style={{ 
                          fontFamily: 'var(--font-nothing), monospace',
                          opacity: isHovered ? 1 : 0
                        }}
                      >
                        Glycoconjugate Laboratory for Analysis & Computational Infrastructure for Enabling Research
                      </h5>
                    ) : (
                      <h1 
                        className="text-2xl font-mono text-black transition-opacity duration-300" 
                        style={{ 
                          fontFamily: 'var(--font-nothing), monospace',
                          opacity: isHovered ? 0 : 1
                        }}
                      >
                        GLACIER
                      </h1>
                    )}
                  </div>
                </div>
              </Link>
            </div>

            {/* RIGHT: Documentation Link */}
            <div className="flex justify-end">
              <Link
                href="/documentation"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-black/50 hover:text-black/80 hover:bg-white/30 transition-all duration-200 cursor-pointer"
                style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Docs
              </Link>
            </div>

          </div>
        </SimplifiedGlassSurface>
      </div>
    </header>
  )
}
