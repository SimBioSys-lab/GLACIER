"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Menu, Grid3X3 } from "lucide-react"
import GlassSurface from '../GlassSurface'

interface HeaderProps {
  onScrollToForm: () => void
}

export default function Header({ onScrollToForm }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll for enhanced backdrop
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Variants for staggered slide-up
  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: 0.05 }
    }
  }
  const lineVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 0.7,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="flex justify-center pt-4 px-4">
        <GlassSurface
          displace={0.5}
          distortionScale={-180}
          redOffset={0}
          greenOffset={10}
          blueOffset={20}
          brightness={100}
          opacity={0.93}
          backgroundOpacity={0}
          saturation={1}
          blur={11}
          mixBlendMode="screen"
          borderRadius={50}
          borderWidth={0.07}
          width="80%"
          height="9vh"
          borderRadius={50}
          borderWidth={0.07}

          className="pointer-events-auto max-w-7xl"
        >
          <div className="px-6 py-4 w-full">
            <div className="flex items-center justify-between">
              {/* Logo - Exact typography */}
              <div className="flex items-center space-x-3">
                
                <h1 className="text-xl font-bold tracking-tight font-nothing" style={{ fontFamily: 'var(--font-nothing), monospace' }}>GLACIER</h1>
                {/* Tagline: always animate on refresh */}
                <motion.div
                  className="text-xs text-[#1A1A1A]/70 leading-tight will-change-transform"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  <motion.div variants={lineVariants}>A</motion.div>
                  <motion.div variants={lineVariants} className="text-center">SimBioSys</motion.div>
                  <motion.div variants={lineVariants}>Initiative</motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </GlassSurface>
      </div>
    </header>
  )
}
