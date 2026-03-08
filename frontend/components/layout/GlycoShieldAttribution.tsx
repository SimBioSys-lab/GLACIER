"use client"

import React from "react"

export default function GlycoShieldAttribution() {
  return (
    <div className="w-full py-10 px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Decorative line with icon */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#8B7DFF]/40" />
          <div className="w-8 h-8 rounded-full bg-[#8B7DFF]/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#8B7DFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
            The GlycoShield pipeline has been developed together by the{' '}
            <a 
              href="https://cnls.lanl.gov/External/people/Gnana_Gnanakaran.php" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#8B7DFF] hover:text-[#7B6DFF] font-semibold transition-colors"
            >
              Gnanakaran Group
            </a>
            , the{' '}
            <a 
              href="https://zberndsen.mufaculty.umsystem.edu/home" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#8B7DFF] hover:text-[#7B6DFF] font-semibold transition-colors"
            >
              Berndsen Group
            </a>
            , and the{' '}
            <a 
              href="https://www.simbiosyslab.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#8B7DFF] hover:text-[#7B6DFF] font-semibold transition-colors"
            >
              SimBioSys Lab
            </a>
            .
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
