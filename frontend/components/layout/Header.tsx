"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import GlassSurface from '../GlassSurface'

interface HeaderProps {
  onScrollToForm: () => void
}

export default function Header({ onScrollToForm }: HeaderProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="flex justify-center pt-6 px-4">
        <GlassSurface
          displace={0.5}
          distortionScale={-180}
          redOffset={0}
          greenOffset={10}
          blueOffset={20}
          brightness={100}
          opacity={0.6}
          backgroundOpacity={0}
          saturation={1}
          blur={12}
          mixBlendMode="screen"
          borderRadius={50}
          borderWidth={0.07}
          width="85%" 
          height="auto"
          className="pointer-events-auto max-w-7xl"
        >
          {/* Reduced padding (py-2) for a slimmer look */}
          <div className="grid grid-cols-3 items-center px-8 py-2">
            
            {/* LEFT: Anchor Text */}
            <div className="flex justify-start">
               <div className="flex flex-col leading-none"> {/* leading-none tightens vertical space */}
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
              <motion.div 
                className="relative flex flex-col items-center justify-center cursor-pointer min-w-[300px]"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                <AnimatePresence mode="wait">
                  {isHovered ? (
                    <motion.div
                      key="full"
                      initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="text-center absolute w-[200%]" 
                    >
                      <h5 
                        className="text-l font-mono text-black/70" 
                        style={{ fontFamily: 'var(--font-nothing), monospace' }}
                      >
                        Glycan Accessibility Computational Infrastructure for Ensemble Research
                      </h5>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="short"
                      initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="text-center"
                    >
                      <h1 
                        className="text-xl font-mono text-black" 
                        style={{ fontFamily: 'var(--font-nothing), monospace' }}
                      >
                        GLACIER
                      </h1>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* RIGHT: Empty div to balance the grid (Keeps GLACIER centered) */}
            <div className="flex justify-end">
               {/* Intentionally empty */}
            </div>

          </div>
        </GlassSurface>
      </div>
    </header>
  )
}