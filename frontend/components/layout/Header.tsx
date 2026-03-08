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

            {/* RIGHT: Empty div to balance the grid (Keeps GLACIER centered) */}
            <div className="flex justify-end">
               {/* Intentionally empty */}
            </div>

          </div>
        </SimplifiedGlassSurface>
      </div>
    </header>
  )
}
