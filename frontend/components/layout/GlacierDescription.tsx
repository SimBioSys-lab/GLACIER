"use client"

import React from "react"

export default function GlacierDescription() {
  return (
    <div className="w-full py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Decorative line with icon */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#8B7DFF]/40" />
          <div className="w-8 h-8 rounded-full bg-[#8B7DFF]/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#8B7DFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#8B7DFF]/40" />
        </div>
        
        {/* Main text */}
        <div className="text-center">
          <p 
            className="text-base md:text-lg text-[#1A1A1A]/70 leading-relaxed"
            style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
          >
            <span 
              className="font-bold text-[#8B7DFF] text-lg md:text-xl"
              style={{ fontFamily: 'var(--font-nothing), monospace' }}
            >
              GLACIER
            </span>
            {' '}is a community-facing platform that provides computational tools and infrastructure for the analysis and modeling of glycans, glycoproteins, and other glycoconjugates. It integrates physics-based simulations, data-driven methods, and structural analyses for scalable research across glycoscience and immunology.
          </p>
        </div>
        
        {/* Bottom decorative dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="w-1.5 h-1.5 rounded-full bg-[#8B7DFF]/30" />
          <div className="w-1 h-1 rounded-full bg-[#8B7DFF]/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#8B7DFF]/30" />
        </div>
      </div>
    </div>
  )
}
