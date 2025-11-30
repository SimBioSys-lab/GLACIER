"use client"

import React, { useState, useRef, useEffect } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import VideoHeroSection from "@/components/hero/VideoHeroSection"
import MultiStepForm from "@/components/form/MultiStepForm"
import CitationSection from "@/components/citation/CitationSection"
import CitationWidget from "@/components/citation/CitationWidget"
import { SubmissionStatus } from "@/components/submission-status"

export default function CicadaSimBioSysInterface() {
  const [showForm, setShowForm] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [jobIds, setJobIds] = useState<string[]>([])
  const [azureUrl, setAzureUrl] = useState<string>()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const formSectionRef = useRef<HTMLDivElement>(null)

  // Scroll detection for form visibility
  useEffect(() => {
    const handleScroll = () => {
      if (formSectionRef.current) {
        const rect = formSectionRef.current.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0
        setShowForm(isVisible)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmitSuccess = (newJobIds: string[], azureUrl?: string) => {
    setJobIds(newJobIds)
    console.log('Setting Azure URL in page.tsx:', azureUrl)
    setAzureUrl(azureUrl)
    setIsSubmitted(true)
    setSubmitError(false)
  }

  const handleSubmitError = (error: string) => {
    setSubmitError(true)
    setErrorMessage(error)
    
    // Clear error after delay
    setTimeout(() => {
      setSubmitError(false)
      setErrorMessage('')
    }, 5000)
  }

  return (
    <div className="relative min-h-screen text-[#1A1A1A] font-sans">
      {/* Floating Header - Outside normal document flow */}
      <Header onScrollToForm={scrollToForm} />

      {/* Main Content Container - Starts at viewport top */}
      <main className="relative">
        {/* Hero Section with Video Background */}
        <VideoHeroSection onScrollToForm={scrollToForm} />
        

        {/* Multi-Step Form Section */}
        <MultiStepForm 
          ref={formSectionRef}
          showForm={showForm}
          onSubmitSuccess={handleSubmitSuccess}
          onSubmitError={handleSubmitError}
        />

        {/* Citation Section - New Addition */}
        <div id="citation">
          <CitationSection />
        </div>

        {/* Status Messages */}
          <SubmissionStatus
            isSubmitted={isSubmitted}
            isError={submitError}
            errorMessage={errorMessage}
            jobIds={jobIds}
            azureUrl={azureUrl}
            onClose={() => {
              setIsSubmitted(false)
              setSubmitError(false)
              setJobIds([])
              setAzureUrl(undefined)
            }}
          />

        {/* Footer Section */}
        <Footer />
      </main>

      {/* Floating Citation Widget - Optional, can be toggled on/off */}
      <CitationWidget />
    </div>
  )
}

