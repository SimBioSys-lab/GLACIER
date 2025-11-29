"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import GlassSurface from '../GlassSurface'

/** Types a sentence with a highlighted middle segment (keeps styling intact). */
function TypewriterParagraph({
  lead,
  highlight,
  tail,
  className = "",
  speed = 24,       // ms per character (lower = faster)
  startDelay = 400, // ms before typing starts
  showCaret = true
}: {
  lead: string
  highlight: string
  tail: string
  className?: string
  speed?: number
  startDelay?: number
  showCaret?: boolean
}) {
  const [count, setCount] = useState(0)
  const total = lead.length + highlight.length + tail.length

  useEffect(() => {
    const delay = setTimeout(() => {
      const id = setInterval(() => {
        setCount((c) => {
          if (c >= total) {
            clearInterval(id)
            return c
          }
          return c + 1
        })
      }, speed)
      return () => clearInterval(id)
    }, startDelay)
    return () => clearTimeout(delay)
  }, [speed, startDelay, total])

  // Compute visible segments
  const leadEnd = Math.min(count, lead.length)
  const midEnd = Math.min(Math.max(0, count - lead.length), highlight.length)
  const tailEnd = Math.min(Math.max(0, count - lead.length - highlight.length), tail.length)

  const leadText = lead.slice(0, leadEnd)
  const highlightText = highlight.slice(0, midEnd)
  const tailText = tail.slice(0, tailEnd)

  const done = count >= total

  return (
    <p className={className} aria-live="polite">
      {leadText}
      <span className="font-medium">{highlightText}</span>
      {tailText}
      {showCaret && (
        <span className={`inline-block w-[0.6ch] ${done ? "opacity-0" : "opacity-80"} animate-pulse`}>
          |
        </span>
      )}
    </p>
  )
}

interface VideoHeroSectionProps {
  onScrollToForm: () => void
}

export default function VideoHeroSection({ onScrollToForm }: VideoHeroSectionProps) {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  // Set video playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75
    }
  }, [videoLoaded])

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
          {/* Glassmorphic Card with GlassSurface */}
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: videoLoaded ? 0 : 0.3 }}
            className="max-w-xl"
          >
            <GlassSurface
              displace={0.5}
              distortionScale={0}
              redOffset={0}
              greenOffset={10}
              blueOffset={20}
              brightness={100}
              opacity={0.9}
              backgroundOpacity={0.5}
              saturation={1}
              blur={25}
              mixBlendMode="normal"
              borderRadius={50}
              borderWidth={0}
              backgroundColor="#ffffff"
              width="100%"
              height="auto"
            >
              <div className="p-6 md:p-8 w-full">
                {/* Small logo/branding */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-6 flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#8B7DFF] to-[#A594FF] rounded-lg flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full opacity-90" />
                  </div>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  className="text-2xl md:text-3xl xl:text-4xl font-light leading-[1.1] mb-6 tracking-[0.015em] max-w-[20ch] font-mono text-black/70"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  style={{ fontFamily: 'var(--font-nothing), monospace' }}
                >
                  Our mission is to decode
                  <br />
                  <span className="font-normal text-[#8B7DFF]">Glycan Shielding</span>
                  <br />
                  on viral proteins.
                </motion.h1>

                {/* Subheadline */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.55 }}
                  className="mb-10 max-w-lg"
                >
                  <TypewriterParagraph
                    className="text-base md:text-lg font-mono text-black/70 leading-relaxed"
                    lead="At SimBioSys, we believe understanding protein glycosylation shouldn't require supercomputing expertise. "
                    highlight="Democratizing structural biology through accessible computational tools that reveal "
                    tail="how glycans shield and expose protein surfaces."
                    speed={22}        // tweak typing speed (ms/char)
                    startDelay={550}  // aligns with your motion.div delay
                  />
                </motion.div>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="flex items-center gap-4 flex-wrap"
                >
                  <motion.button
                    onClick={onScrollToForm}
                    className="bg-[#8B7DFF] hover:bg-[#7B6DFF] text-white px-8 py-4 rounded-lg font-medium font-mono transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.12 }}
                  >
                    Start Analysis
                  </motion.button>

                  <motion.a
                    href="#learn-more"
                    className="text-[#8B7DFF] hover:text-[#7B6DFF] font-medium px-4 py-4 transition-colors duration-200 hover:underline underline-offset-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.12 }}
                  >
                    Learn more
                  </motion.a>
                </motion.div>
              </div>
            </GlassSurface>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={onScrollToForm}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <div className="w-6 h-10 border-2 border-[#1A1A1A]/30 rounded-full flex justify-center">
          <div className="w-0.5 h-2 bg-[#1A1A1A]/50 rounded-full mt-2" />
        </div>
      </motion.button>
    </section>
  )
}
