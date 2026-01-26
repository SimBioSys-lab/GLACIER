"use client"

import React from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import GlacierDescription from "@/components/layout/GlacierDescription"
import VideoHeroSection from "@/components/hero/VideoHeroSection"
import CitationSection from "@/components/citation/CitationSection"
import CitationWidget from "@/components/citation/CitationWidget"
import FreeAccessSection from "@/components/FreeAccessSection"

export default function CicadaSimBioSysInterface() {
  const scrollToCitation = () => {
    document.getElementById('citation')?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="relative min-h-screen text-[#1A1A1A] font-sans">
      {/* Floating Header - Outside normal document flow */}
      <Header onScrollToForm={scrollToCitation} />

      {/* Main Content Container - Starts at viewport top */}
      <main className="relative">
        {/* Hero Section with Video Background */}
        <VideoHeroSection />

        {/* GLACIER Description */}
        <GlacierDescription />

        {/* Citation Section */}
        <div id="citation">
          <CitationSection />
        </div>

        {/* Free Access Statement */}
        <FreeAccessSection />

        {/* Footer Section */}
        <Footer />
      </main>

      {/* Floating Citation Widget - Optional, can be toggled on/off */}
      <CitationWidget />
    </div>
  )
}
