"use client"

import React, { useState, useRef } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import MultiStepForm from "@/components/form/MultiStepForm"
import { SubmissionStatus } from "@/components/submission-status"
import GlycoShieldCitation from "@/components/citation/GlycoShieldCitation"

export default function GlycoShieldPage() {
  const [submitError, setSubmitError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [jobIds, setJobIds] = useState<string[]>([])
  const [azureUrl, setAzureUrl] = useState<string>()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const formSectionRef = useRef<HTMLDivElement>(null)

  const handleSubmitSuccess = (newJobIds: string[], azureUrl?: string) => {
    setJobIds(newJobIds)
    console.log('Setting Azure URL in glycoshield page:', azureUrl)
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
    <div className="relative min-h-screen text-[#1A1A1A] font-sans bg-gradient-to-br from-[#F5F4F9] via-[#E8E3F0] to-[#DDD4E8]">
      {/* Floating Header - Same as homepage */}
      <Header onScrollToForm={() => formSectionRef.current?.scrollIntoView({ behavior: "smooth" })} />

      {/* Main Content Container with top spacing */}
      <main className="relative pt-32">
        {/* Multi-Step Form Section */}
        <MultiStepForm 
          ref={formSectionRef}
          showForm={true}
          onSubmitSuccess={handleSubmitSuccess}
          onSubmitError={handleSubmitError}
        />

        {/* Citation Section - GlycoShield specific */}
        <GlycoShieldCitation />

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
    </div>
  )
}
