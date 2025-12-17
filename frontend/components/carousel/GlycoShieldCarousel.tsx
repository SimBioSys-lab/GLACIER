"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface GlycoShieldCarouselProps {
  autoPlayDuration?: number
}

export default function GlycoShieldCarousel({ autoPlayDuration = 20000 }: GlycoShieldCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const slides = [
    {
      src: '/assets/images/glcyoshield/Slide1.png',
      alt: 'The Viral Glycan Shield',
      title: 'The Viral Glycan Shield'
    },
    {
      src: '/assets/images/glcyoshield/Slide2.png',
      alt: 'Dynamics drives shielding',
      title: 'The Viral Glycan Shield',
      subtitle: 'Dynamics drives shielding'
    },
    {
      src: '/assets/images/glcyoshield/Slide3.png',
      alt: 'High-throughput pipeline',
      title: 'Our High-throughput Pipeline',
      subtitle: 'Generate glycan ensemble at atomistic detail'
    },
    {
      src: '/assets/images/glcyoshield/Slide4.png',
      alt: 'Glycan Shield topological network',
      title: 'Glycan Shield Topological Network'
    },
    {
      src: '/assets/images/glcyoshield/Slide5.png',
      alt: 'Describing glycan shield topology',
      title: 'Describing the Glycan Shield Topology',
      subtitle: 'As a network'
    },
    {
      src: '/assets/images/glcyoshield/Slide6.png',
      alt: 'Communities of glycan subdomains',
      title: 'Communities of Glycan Subdomains'
    },
    {
      src: '/assets/images/glcyoshield/Slide7.png',
      alt: 'Quantifying the shielding effect',
      title: 'Quantifying the Shielding Effect'
    },
    {
      src: '/assets/images/glcyoshield/Slide8.png',
      alt: 'Example GEF surfaces',
      title: 'Example GEF Surfaces',
      subtitle: 'Using our pipeline'
    }
  ]

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
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
            How <span className="font-vt323 text-[#8B7DFF] text-5xl">GlycoShield</span> Works
          </h2>
          <p 
            className="text-lg text-black/60 max-w-2xl mx-auto"
            style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
          >
            Explore our computational pipeline for ensemble-based glycan shielding analysis
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

        {/* Carousel Container - Custom Glass Effect */}
        <div 
          className="relative w-full rounded-[32px]"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(25px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(25px) saturate(1.8)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: `
              0 8px 32px 0 rgba(31, 38, 135, 0.15),
              0 2px 16px 0 rgba(31, 38, 135, 0.1),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.5),
              inset 0 -1px 0 0 rgba(255, 255, 255, 0.3)
            `,
            height: '600px'
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Inner container with background */}
          <div 
            className="relative w-full h-full rounded-[32px] overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)'
            }}
          >
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
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px'
                }}
              >
                {/* Image with container */}
                <div 
                  style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '1200px',
                    maxHeight: '536px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    background: 'white',
                    position: 'relative'
                  }}
                >
                  {/* Gradient overlay */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(139, 125, 255, 0.05) 0%, transparent 50%, rgba(139, 125, 255, 0.05) 100%)',
                      pointerEvents: 'none',
                      zIndex: 10
                    }}
                  />
                  
                  {/* Image */}
                  <img
                    src={slides[currentSlide].src}
                    alt={slides[currentSlide].alt}
                    draggable={false}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block',
                      position: 'relative',
                      zIndex: 1
                    }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={() => paginate(-1)}
              className="group"
              aria-label="Previous slide"
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 20
              }}
            >
              <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-black/10 shadow-lg flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:scale-110 group-hover:shadow-xl">
                <svg 
                  className="w-6 h-6 text-[#8B7DFF] transition-transform group-hover:-translate-x-0.5" 
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
              className="group"
              aria-label="Next slide"
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 20
              }}
            >
              <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-black/10 shadow-lg flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:scale-110 group-hover:shadow-xl">
                <svg 
                  className="w-6 h-6 text-[#8B7DFF] transition-transform group-hover:translate-x-0.5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Slide Indicators */}
            <div 
              style={{
                position: 'absolute',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="group relative"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {/* Background ring for active indicator */}
                  {currentSlide === index && (
                    <motion.div
                      layoutId="activeIndicator"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(139, 125, 255, 0.2)',
                        borderRadius: '50%',
                        padding: '4px'
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {/* Dot */}
                  <div
                    className={`relative w-2 h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? 'bg-[#8B7DFF] scale-125'
                        : 'bg-white/60 group-hover:bg-white/90 group-hover:scale-110'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Slide Counter & Pause/Play */}
            <div 
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              {/* Counter */}
              <div 
                className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-black/10 shadow-lg text-sm font-medium text-black/70"
                style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
              >
                {currentSlide + 1} / {slides.length}
              </div>

              {/* Pause/Play Button */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-black/10 shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110"
                aria-label={isPaused ? 'Play slideshow' : 'Pause slideshow'}
              >
                {isPaused ? (
                  <svg className="w-4 h-4 text-[#8B7DFF] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-[#8B7DFF]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Progress Bar */}
            {!isPaused && (
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  zIndex: 30,
                  borderRadius: '0 0 32px 32px',
                  overflow: 'hidden'
                }}
              >
                <motion.div
                  key={currentSlide}
                  style={{
                    height: '100%',
                    background: '#8B7DFF'
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
            Use arrow keys or drag to navigate • Hover to pause
          </p>
        </div>
      </div>
    </section>
  )
}
