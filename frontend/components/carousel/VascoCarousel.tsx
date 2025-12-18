"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface VascoCarouselProps {
  autoPlayDuration?: number
}

export default function VascoCarousel({ autoPlayDuration = 20000 }: VascoCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const slides = [
    {
      src: '/assets/images/vasco/Slide1.png',
      alt: 'VASCO Overview',
      title: 'VASCO Overview',
      subtitle: 'Placeholder - update with actual title'
    },
    {
      src: '/assets/images/vasco/Slide2.png',
      alt: 'VASCO Analysis',
      title: 'VASCO Analysis',
      subtitle: 'Placeholder - update with actual title'
    },
    {
      src: '/assets/images/vasco/Slide3.png',
      alt: 'VASCO Methodology',
      title: 'VASCO Methodology',
      subtitle: 'Placeholder - update with actual title'
    },
    {
      src: '/assets/images/vasco/Slide4.png',
      alt: 'VASCO Results',
      title: 'VASCO Results',
      subtitle: 'Placeholder - update with actual title'
    },
    {
      src: '/assets/images/vasco/Slide5.png',
      alt: 'VASCO Predictions',
      title: 'VASCO Predictions',
      subtitle: 'Placeholder - update with actual title'
    },
    {
      src: '/assets/images/vasco/Slide6.png',
      alt: 'VASCO Interface',
      title: 'VASCO Interface',
      subtitle: 'Placeholder - update with actual title'
    },
    {
      src: '/assets/images/vasco/Slide7.png',
      alt: 'VASCO Applications',
      title: 'VASCO Applications',
      subtitle: 'Placeholder - update with actual title'
    },
    {
      src: '/assets/images/vasco/Slide8.png',
      alt: 'VASCO Summary',
      title: 'VASCO Summary',
      subtitle: 'Placeholder - update with actual title'
    }
  ]

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 600 : -600,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 600 : -600,
      opacity: 0,
      scale: 0.95
    })
  }

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection)
    setCurrentSlide((prev) => {
      let next = prev + newDirection
      if (next < 0) next = slides.length - 1
      if (next >= slides.length) next = 0
      return next
    })
  }, [slides.length])

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1)
    setCurrentSlide(index)
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        paginate(1)
      }, autoPlayDuration)

      return () => clearInterval(timer)
    }
  }, [currentSlide, isPaused, autoPlayDuration, paginate])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        paginate(-1)
      } else if (e.key === 'ArrowRight') {
        paginate(1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [paginate])

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl font-semibold text-black/80 mb-4"
            style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
          >
            How <span className="font-vt323 text-[#FF6B9D] text-5xl">VASCO</span> Works
          </h2>
          <p 
            className="text-lg text-black/60 max-w-2xl mx-auto"
            style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
          >
            AI-powered antibody-antigen interface prediction for vaccine design
          </p>
        </div>

        {/* Slide Title - Above Carousel */}
        <div className="text-center mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 
                className="text-2xl md:text-3xl font-semibold text-[#2D2A5F] mb-2"
                style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
              >
                {currentSlide + 1}. {slides[currentSlide].title}
              </h3>
              {slides[currentSlide].subtitle && (
                <p 
                  className="text-base md:text-lg text-black/60 max-w-3xl mx-auto"
                  style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                >
                  {slides[currentSlide].subtitle}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Container with Ambient Effects */}
        <div className="relative">
          {/* Outer ambient glow - Pink theme */}
          <div 
            className="absolute -inset-4 rounded-[48px] opacity-50"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255, 107, 157, 0.15) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
          
          {/* Secondary ambient layer */}
          <div 
            className="absolute -inset-2 rounded-[40px]"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.08) 0%, rgba(255, 150, 180, 0.05) 50%, rgba(255, 107, 157, 0.08) 100%)',
              filter: 'blur(20px)',
            }}
          />

          {/* Main Carousel Container */}
          <div 
            className="relative w-full rounded-[32px] overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
              backdropFilter: 'blur(30px) saturate(1.5)',
              WebkitBackdropFilter: 'blur(30px) saturate(1.5)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              boxShadow: `
                0 0 0 1px rgba(255, 107, 157, 0.05),
                0 4px 16px 0 rgba(255, 107, 157, 0.08),
                0 8px 32px 0 rgba(31, 38, 135, 0.1),
                0 16px 48px 0 rgba(31, 38, 135, 0.08),
                inset 0 1px 0 0 rgba(255, 255, 255, 0.8),
                inset 0 -1px 0 0 rgba(255, 255, 255, 0.4)
              `,
              height: '600px'
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Inner soft vignette effect */}
            <div 
              className="absolute inset-0 pointer-events-none z-[5] rounded-[32px]"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 50%, rgba(255, 107, 157, 0.03) 100%)',
              }}
            />

            {/* Slides */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 250, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 }
                }}
                className="absolute inset-0 flex items-center justify-center p-8 md:p-12"
              >
                {/* Image container with ambient effect */}
                <div className="relative w-full h-full max-w-[1100px] max-h-[500px]">
                  {/* Image ambient glow - matches image colors */}
                  <div 
                    className="absolute -inset-6 rounded-3xl opacity-40"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.8) 0%, rgba(255, 107, 157, 0.1) 50%, transparent 70%)',
                      filter: 'blur(30px)',
                    }}
                  />
                  
                  {/* Soft edge fade container */}
                  <div 
                    className="relative w-full h-full rounded-2xl overflow-hidden"
                    style={{
                      boxShadow: `
                        0 0 0 1px rgba(255, 255, 255, 0.5),
                        0 4px 12px rgba(0, 0, 0, 0.08),
                        0 8px 24px rgba(255, 107, 157, 0.1),
                        0 16px 48px rgba(0, 0, 0, 0.1)
                      `,
                    }}
                  >
                    {/* White background for image */}
                    <div className="absolute inset-0 bg-white" />
                    
                    {/* Subtle gradient overlay for blending */}
                    <div 
                      className="absolute inset-0 pointer-events-none z-10"
                      style={{
                        background: `
                          linear-gradient(to right, rgba(255,255,255,0.3) 0%, transparent 3%, transparent 97%, rgba(255,255,255,0.3) 100%),
                          linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, transparent 3%, transparent 97%, rgba(255,255,255,0.3) 100%)
                        `,
                      }}
                    />
                    
                    {/* Image */}
                    <img
                      src={slides[currentSlide].src}
                      alt={slides[currentSlide].alt}
                      draggable={false}
                      className="relative z-[1] w-full h-full object-contain"
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows - Pink theme */}
            <button
              onClick={() => paginate(-1)}
              className="group absolute left-4 top-1/2 -translate-y-1/2 z-20"
              aria-label="Previous slide"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(255, 107, 157, 0.1)',
                }}
              >
                <svg 
                  className="w-5 h-5 text-[#FF6B9D] transition-transform group-hover:-translate-x-0.5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => paginate(1)}
              className="group absolute right-4 top-1/2 -translate-y-1/2 z-20"
              aria-label="Next slide"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(255, 107, 157, 0.1)',
                }}
              >
                <svg 
                  className="w-5 h-5 text-[#FF6B9D] transition-transform group-hover:translate-x-0.5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Slide Indicators - Pink theme */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="group relative p-1"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? 'bg-[#FF6B9D] scale-125'
                        : 'bg-black/20 group-hover:bg-black/40 group-hover:scale-110'
                    }`}
                  />
                  {currentSlide === index && (
                    <motion.div
                      layoutId="activeIndicatorVasco"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'rgba(255, 107, 157, 0.2)',
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Slide Counter & Pause/Play */}
            <div className="absolute top-5 right-5 z-20 flex items-center gap-3">
              <div 
                className="px-4 py-2 rounded-full text-sm font-medium text-black/60"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  fontFamily: 'var(--font-geist-sans), sans-serif'
                }}
              >
                {currentSlide + 1} / {slides.length}
              </div>

              <button
                onClick={() => setIsPaused(!isPaused)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                }}
                aria-label={isPaused ? 'Play slideshow' : 'Pause slideshow'}
              >
                {isPaused ? (
                  <svg className="w-4 h-4 text-[#FF6B9D] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-[#FF6B9D]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Progress Bar - Pink theme */}
            {!isPaused && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-1 z-30 overflow-hidden"
                style={{
                  background: 'rgba(255, 107, 157, 0.1)',
                }}
              >
                <motion.div
                  key={currentSlide}
                  className="h-full"
                  style={{
                    background: 'linear-gradient(90deg, #FF6B9D 0%, #ff8fb3 100%)',
                  }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: autoPlayDuration / 1000, ease: 'linear' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Keyboard Navigation Hint */}
        <div className="mt-6 text-center">
          <p 
            className="text-sm text-black/40"
            style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
          >
            Use arrow keys to navigate • Hover to pause
          </p>
        </div>
      </div>
    </section>
  )
}
