"use client"

import React from 'react'
import { motion } from 'framer-motion'

export default function FreeAccessSection() {
  return (
    <section id="free-access-section" className="py-24 px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 via-white to-gray-50/50" />
      
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="container mx-auto max-w-6xl relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* Main Card */}
          <div className="relative">
            {/* Glow effects behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#8B7DFF]/20 via-[#a899ff]/10 to-[#FF6B9D]/20 rounded-[2.5rem] blur-2xl opacity-60" />
            
            <div 
              className="relative rounded-[2rem] overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(139, 125, 255, 0.15)',
                boxShadow: `
                  0 4px 6px -1px rgba(0, 0, 0, 0.05),
                  0 10px 15px -3px rgba(0, 0, 0, 0.05),
                  0 20px 25px -5px rgba(139, 125, 255, 0.05),
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.8)
                `,
              }}
            >
              {/* Top accent bar */}
              <div className="h-1 bg-gradient-to-r from-[#8B7DFF] via-[#a899ff] to-[#FF6B9D]" />

              {/* Inner content */}
              <div className="p-10 md:p-14">
                {/* Header with icon */}
                <div className="flex items-center gap-4 mb-8">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center relative"
                    style={{
                      background: 'linear-gradient(135deg, #8B7DFF 0%, #a899ff 50%, #FF6B9D 100%)',
                      boxShadow: '0 8px 16px -4px rgba(139, 125, 255, 0.4)',
                    }}
                  >
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <div>
                    <h2 
                      className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-[#2D2A5F] to-[#4a4578] bg-clip-text text-transparent"
                      style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                    >
                      Free & Open Access
                    </h2>
                    <p className="text-black/40 text-sm mt-1" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                      No barriers to scientific discovery
                    </p>
                  </div>
                </div>

                {/* Main content with better typography */}
                <div className="space-y-5 text-black/65 text-[1.05rem] leading-[1.8]" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                  <p>
                    This webserver is{' '}
                    <span className="relative inline-block">
                      <span className="relative z-10 font-semibold text-[#8B7DFF]">freely accessible</span>
                      <span className="absolute bottom-0 left-0 right-0 h-2 bg-[#8B7DFF]/10 -z-0 rounded" />
                    </span>
                    {' '}to all users for academic, educational, and non-commercial research purposes. No login, subscription, or institutional affiliation is required to access the core functionality.
                  </p>
                  
                  <p>
                    Users may submit jobs, visualize results, and download outputs without charge. The platform is provided to support the scientific community in advancing research on{' '}
                    <span className="font-medium text-black/75">viral glycoproteins</span>,{' '}
                    <span className="font-medium text-black/75">antibody–antigen interactions</span>, and{' '}
                    <span className="font-medium text-black/75">immunogen design</span>.
                  </p>

                  <p className="text-black/50 italic">
                    We encourage use by experimentalists, computational researchers, educators, and trainees.
                  </p>
                </div>

                {/* Divider with icon */}
                <div className="my-10 flex items-center gap-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 border border-black/5 flex items-center justify-center">
                    <svg className="w-4 h-4 text-black/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
                </div>

                {/* Footer cards */}
                <div className="grid md:grid-cols-2 gap-5">
                  {/* Citation Card */}
                  <div 
                    className="group p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(139, 125, 255, 0.05) 0%, rgba(139, 125, 255, 0.02) 100%)',
                      border: '1px solid rgba(139, 125, 255, 0.1)',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                        style={{
                          background: 'linear-gradient(135deg, rgba(139, 125, 255, 0.15) 0%, rgba(139, 125, 255, 0.05) 100%)',
                          border: '1px solid rgba(139, 125, 255, 0.2)',
                        }}
                      >
                        <svg className="w-5 h-5 text-[#8B7DFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#2D2A5F] mb-1.5" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                          Citation Request
                        </h4>
                        <p className="text-sm text-black/50 leading-relaxed" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                          Users are asked to acknowledge the use of this webserver in resulting publications by citing the relevant references provided on the site.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Fair Use Card */}
                  <div 
                    className="group p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.05) 0%, rgba(255, 107, 157, 0.02) 100%)',
                      border: '1px solid rgba(255, 107, 157, 0.1)',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.15) 0%, rgba(255, 107, 157, 0.05) 100%)',
                          border: '1px solid rgba(255, 107, 157, 0.2)',
                        }}
                      >
                        <svg className="w-5 h-5 text-[#FF6B9D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#2D2A5F] mb-1.5" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                          Fair Use Policy
                        </h4>
                        <p className="text-sm text-black/50 leading-relaxed" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                          The developers make no guarantee of uninterrupted service and reserve the right to introduce reasonable usage limits to ensure fair access for all users.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
