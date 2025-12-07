"use client"

import React from "react"
import SimplifiedGlassSurface from '../SimplifiedGlassSurface'

interface HeaderProps {
  onScrollToForm: () => void
}

export default function HeaderSimple({ onScrollToForm }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="flex justify-center pt-6 px-4">
        <SimplifiedGlassSurface
          borderRadius={50}
          blur={10}
          opacity={0.7}
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

            {/* CENTER: GLACIER Title (no hover animation) */}
            <div className="flex justify-center">
              <div className="text-center">
                <h1 
                  className="text-xl font-mono text-black" 
                  style={{ fontFamily: 'var(--font-nothing), monospace' }}
                >
                  GLACIER
                </h1>
              </div>
            </div>

            {/* RIGHT: Empty div to balance the grid */}
            <div className="flex justify-end">
               {/* Intentionally empty */}
            </div>

          </div>
        </SimplifiedGlassSurface>
      </div>
    </header>
  )
}
