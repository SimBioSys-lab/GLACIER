"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SimplifiedGlassSurface from '../SimplifiedGlassSurface'
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function VideoHeroSection() {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const router = useRouter()
  const totalSlides = 2 // Number of cards

  // Set video playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75
    }
  }, [videoLoaded])

  // Auto-slide every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const handleStartAnalysis = () => {
    router.push('/glycoshield')
  }

  const scrollToCitation = () => {
    document.getElementById('citation')?.scrollIntoView({ behavior: "smooth" })
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
          onLoadedData={() => setVideoLoaded(true)}
        >
          <source 
            src="/assets/videos/Antibody_Binds_Viral_Protein_Animation.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Vignette + right-side emphasis fade (keeps text legible on top) */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        {/* soft global vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/10" />
        {/* right-to-left fade so left glass card pops more */}
        <div className="absolute inset-0 lg:bg-gradient-to-l lg:from-white/30 lg:via-white/10 lg:to-transparent" />
      </div>

      {/* Hero Content (glassmorphic left panel stacked on top of scene) */}
      <div className="relative z-10 container mx-auto ml-[10vw] px-6 pt-28 md:pt-36 pb-16">
        <div className="min-h-[calc(100vh-10rem)] flex items-start md:items-center">
          {/* Carousel Container */}
          <div className="max-w-xl w-full relative">
            {/* Card Display */}
            <div 
              className="opacity-0 animate-fadeIn relative" 
              style={{ animationDelay: videoLoaded ? '0ms' : '300ms', animationFillMode: 'forwards' }}
            >
              <SimplifiedGlassSurface
                borderRadius={50}
                blur={20}
                opacity={0.9}
                className="w-full"
              >
                <div className="p-6 md:p-8 w-full">
                  {/* Small logo/branding */}
                  <div className="mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#8B7DFF] to-[#A594FF] rounded-lg flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full opacity-90" />
                    </div>
                  </div>

                  {/* Headline */}
                  <h1
                    className="text-2xl md:text-3xl xl:text-4xl font-light leading-[1.1] mb-6 tracking-[0.015em] max-w-[20ch] font-mono text-black/70"
                    style={{ fontFamily: 'var(--font-nothing), monospace' }}
                  >
                    Our mission is to decode
                    <br />
                    <span className="font-normal text-[#8B7DFF]">Glycan Shielding</span>
                    <br />
                    on viral proteins.
                  </h1>

                  {/* Subheadline - Static text, no typewriter */}
                  <div className="mb-10 max-w-lg">
                    <p className="text-base md:text-lg font-mono text-black/70 leading-relaxed">
                      At SimBioSys, we believe understanding protein glycosylation shouldn't require supercomputing expertise. <span className="font-medium">Democratizing structural biology through accessible computational tools that reveal</span> how glycans shield and expose protein surfaces.
                    </p>
                  </div>

                  {/* CTAs */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <button
                      onClick={handleStartAnalysis}
                      className="bg-[#8B7DFF] hover:bg-[#7B6DFF] text-white px-8 py-4 rounded-lg font-medium font-mono transition-colors duration-150 shadow-lg hover:shadow-xl"
                    >
                      Start Analysis
                    </button>

                    <a
                      href="#citation"
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToCitation()
                      }}
                      className="text-[#8B7DFF] hover:text-[#7B6DFF] font-medium px-4 py-4 transition-colors duration-150 hover:underline underline-offset-4"
                    >
                      Learn more
                    </a>
                  </div>
                </div>
              </SimplifiedGlassSurface>
            </div>

            {/* Navigation Arrow - Right only */}
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 bg-white/80 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all duration-150 hover:scale-110 z-20"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-[#8B7DFF]" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-[#8B7DFF] w-8 h-2 rounded-full' 
                      : 'bg-white/50 hover:bg-white/80 w-2 h-2 rounded-full'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
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
