"use client"

import React, { useState, useEffect } from "react"
import { Quote, ChevronDown, ChevronUp } from "lucide-react"
import GlassSurface from '../GlassSurface'

export default function CitationWidget() {
  const [isOverFooter, setIsOverFooter] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const scrollToCitation = () => {
    const citationSection = document.getElementById('citation')
    if (citationSection) {
      citationSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    const checkFooterOverlap = () => {
      const footer = document.querySelector('footer')
      const widget = document.querySelector('.citation-widget')
      
      if (footer && widget) {
        const footerRect = footer.getBoundingClientRect()
        const widgetRect = widget.getBoundingClientRect()
        
        // Check if widget overlaps with footer
        const isOverlapping = widgetRect.bottom > footerRect.top
        setIsOverFooter(isOverlapping)
      }
    }

    // Check on scroll and resize
    window.addEventListener('scroll', checkFooterOverlap)
    window.addEventListener('resize', checkFooterOverlap)
    
    // Initial check
    checkFooterOverlap()

    return () => {
      window.removeEventListener('scroll', checkFooterOverlap)
      window.removeEventListener('resize', checkFooterOverlap)
    }
  }, [])

  return (
    <div 
      className="fixed bottom-24 right-6 z-40 citation-widget"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <GlassSurface
        displace={0.3}
        distortionScale={-100}
        brightness={isOverFooter ? 85 : 95}
        opacity={0.93}
        backgroundOpacity={isOverFooter ? 0.2 : 0.1}
        blur={10}
        borderRadius={50}
        borderWidth={0.05}
        className="group cursor-pointer"
      >
        <button
          onClick={scrollToCitation}
          className={`
            px-5 py-3 flex items-center gap-2
            transition-all duration-300
            hover:scale-105 active:scale-95
            ${isOverFooter 
              ? 'text-white hover:text-[#8B7DFF]' 
              : 'text-[#1A1A1A] hover:text-[#8B7DFF]'
            }
          `}
          style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
        >
          <Quote className="w-5 h-5" />
          <span className="text-sm font-semibold">Cite GLACIER</span>
          {isOverFooter ? (
            <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          ) : (
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          )}
        </button>
      </GlassSurface>
      
      {/* Tooltip on hover */}
      <div 
        className={`
          absolute bottom-full right-0 mb-2 pointer-events-none
          transition-opacity duration-200
          ${showTooltip ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <div className={`
          text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors duration-300
          ${isOverFooter 
            ? 'bg-white/90 text-[#1A1A1A]' 
            : 'bg-[#1A1A1A]/90 text-white'
          }
        `}>
          View citation formats
        </div>
      </div>
    </div>
  )
}