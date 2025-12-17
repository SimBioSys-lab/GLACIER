"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SimplifiedGlassSurface from '../SimplifiedGlassSurface'
import DocumentationModal from '../modals/DocumentationModal'

export default function VideoHeroSection() {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'glycoshield' | 'vasco'>('glycoshield')
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const router = useRouter()

  // Tool options
  const tools = [
    {
      id: 0,
      name: "GlycoShield",
      icon: "circle",
      color: "#8B7DFF",
      route: "/glycoshield"
    },
    {
      id: 1,
      name: "VASCO",
      icon: "lightning",
      color: "#FF6B9D",
      route: "/vasco"
    }
  ]

  // Set video playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75
    }
  }, [videoLoaded])

  const scrollToCitation = () => {
    document.getElementById('citation')?.scrollIntoView({ behavior: "smooth" })
  }

  const handleToolSelect = (toolId: number) => {
    setCurrentSlide(toolId)
  }

  const handleStart = () => {
    router.push(tools[currentSlide].route)
  }

  const handleLearnMore = (type: 'glycoshield' | 'vasco') => {
    setModalType(type)
    setModalOpen(true)
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#F5F4F9] via-[#E8E3F0] to-[#DDD4E8]">
      {/* Video Background — full-bleed */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          loop={false}
          onLoadedData={() => setVideoLoaded(true)}
        >
          <source 
            src="/assets/videos/Antibody_Binds_Viral_Protein_Animation.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Vignette + right-side emphasis fade */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/10" />
        <div className="absolute inset-0 lg:bg-gradient-to-l lg:from-white/30 lg:via-white/10 lg:to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto ml-[10vw] px-6 pt-28 md:pt-36 pb-16">
        <div className="min-h-[calc(100vh-10rem)] flex items-start md:items-center">
          <div className="max-w-2xl w-full relative">
            <div 
              className="opacity-0 animate-fadeIn" 
              style={{ animationDelay: videoLoaded ? '0ms' : '300ms', animationFillMode: 'forwards' }}
            >
              <SimplifiedGlassSurface
                borderRadius={50}
                blur={20}
                opacity={0.9}
                className="w-full"
              >
                <div className="p-6 md:p-8 w-full">
                  {/* Segmented Control - Tabs at top */}
                  <div className="mb-8">
                    <div className="inline-flex p-1 rounded-full bg-white/40 backdrop-blur-sm border border-black/10 shadow-sm">
                      {tools.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => handleToolSelect(tool.id)}
                          className={`
                            px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300
                            flex items-center gap-2
                            ${currentSlide === tool.id
                              ? 'bg-white text-black shadow-md scale-105'
                              : 'text-black/60 hover:text-black/80 hover:bg-white/30'
                            }
                          `}
                          style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                        >
                          {/* Icon */}
                          {tool.icon === 'circle' ? (
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: currentSlide === tool.id ? tool.color : 'currentColor' }}
                            />
                          ) : (
                            <svg 
                              className="w-3.5 h-3.5" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                              style={{ color: currentSlide === tool.id ? tool.color : 'currentColor' }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          )}
                          <span>{tool.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content Container - Reduced height for more compact design */}
                  <div className="relative min-h-[420px]">
                    {/* Slide 1: GlycoShield */}
                    <div 
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        currentSlide === 0 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <div className="flex flex-col h-full">
                        {/* Headline */}
                        <h1 className="text-2xl md:text-3xl xl:text-4xl font-normal leading-[1.15] mb-3 tracking-[0.015em] text-black/70" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                          Ensemble Modelling and 
                          <br />Quantification of
                          <br />
                          <span className="font-vt323 text-[#8B7DFF] text-5xl">GLYCAN SHIELDING</span>
                          <br />
                          on viral surface proteins.
                        </h1>

                        {/* Subheadline */}
                        <div className="mb-6 max-w-lg">
                          <p className="text-base text-black/70 leading-relaxed" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                            Understanding protein glycosylation shouldn't require supercomputing expertise. <span className="font-medium">Democratizing structural biology</span> through accessible computational tools.
                          </p>
                        </div>

                        {/* CTAs */}
                        <div className="flex items-center gap-4 flex-wrap mt-auto">
                          <button
                            onClick={handleStart}
                            className="bg-[#8B7DFF] hover:bg-[#7B6DFF] text-white px-8 py-4 rounded-lg font-medium transition-colors duration-150 shadow-lg hover:shadow-xl"
                            style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                          >
                            Start GlycoShield Analysis
                          </button>

                          <button
                            onClick={() => handleLearnMore('glycoshield')}
                            className="text-[#8B7DFF] hover:text-[#7B6DFF] font-medium px-4 py-4 transition-colors duration-150 hover:underline underline-offset-4"
                            style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                          >
                            Learn more
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Slide 2: Paratope Prediction */}
                    <div 
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        currentSlide === 1 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <div className="flex flex-col h-full">
                        {/* Headline */}
                        <h1 className="text-2xl md:text-3xl xl:text-4xl font-normal leading-[1.05] mb-3 tracking-[0.015em] text-black/70" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                          Predict
                          <br />
                          <span className="font-vt323 text-[#FF6B9D] text-5xl">ANTIBODY INTERFACES</span>
                          <br />
                          with AI precision.
                        </h1>

                        {/* Subheadline */}
                        <div className="mb-4 max-w-lg">
                          <p className="text-base text-black/70 leading-relaxed" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                            Identify antibody-antigen binding sites with <span className="font-medium">deep learning</span>. MSA-powered neural networks analyze evolutionary patterns and 3D structure for epitope and paratope predictions.
                          </p>
                        </div>

                        {/* Key Features */}
                        <div className="mb-4 space-y-1">
                          <div className="flex items-center gap-2 text-sm text-black/60" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                            <div className="w-1.5 h-1.5 bg-[#FF6B9D] rounded-full flex-shrink-0" />
                            <span>MSA-based evolutionary analysis</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-black/60" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                            <div className="w-1.5 h-1.5 bg-[#FF6B9D] rounded-full flex-shrink-0" />
                            <span>Graph neural network predictions</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-black/60" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                            <div className="w-1.5 h-1.5 bg-[#FF6B9D] rounded-full flex-shrink-0" />
                            <span>Per-residue confidence scores</span>
                          </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex items-center gap-4 flex-wrap mt-auto">
                          <button
                            onClick={handleStart}
                            className="bg-gradient-to-r from-[#FF6B9D] to-[#C44569] hover:from-[#FF5B8D] hover:to-[#B43559] text-white px-8 py-4 rounded-lg font-medium transition-all duration-150 shadow-lg hover:shadow-xl"
                            style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                          >
                            Predict VASCO
                          </button>

                          <button
                            onClick={() => handleLearnMore('vasco')}
                            className="text-[#FF6B9D] hover:text-[#C44569] font-medium px-4 py-4 transition-colors duration-150 hover:underline underline-offset-4"
                            style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                          >
                            Learn more
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SimplifiedGlassSurface>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToCitation}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 animate-bounce"
      >
        <div className="w-6 h-10 border-2 border-[#1A1A1A]/30 rounded-full flex justify-center">
          <div className="w-0.5 h-2 bg-[#1A1A1A]/50 rounded-full mt-2" />
        </div>
      </button>

      {/* Documentation Modal */}
      <DocumentationModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </section>
  )
}
