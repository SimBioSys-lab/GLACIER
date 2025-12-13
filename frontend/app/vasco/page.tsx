"use client"

import React, { useState, useRef } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import ParatopeMultiStepForm from "@/components/paratope-form/ParatopeMultiStepForm"
import ParatopeCitation from "@/components/citation/ParatopeCitation"
import { ParatopeSubmissionStatus } from "@/components/paratope-submission-status"

export default function VascoPage() {
  const [submitError, setSubmitError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [jobId, setJobId] = useState<string>()
  const [userId, setUserId] = useState<string>()
  const [azureUrl, setAzureUrl] = useState<string>()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const formSectionRef = useRef<HTMLDivElement>(null)

  const handleSubmitSuccess = (jobId: string, userId: string, azureUrl?: string) => {
    setJobId(jobId)
    setUserId(userId)
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

  const handleCloseStatus = () => {
    setIsSubmitted(false)
    setSubmitError(false)
    setJobId(undefined)
    setUserId(undefined)
    setAzureUrl(undefined)
  }

  return (
    <div className="relative min-h-screen text-[#1A1A1A] font-sans bg-gradient-to-br from-[#F5F4F9] via-[#E8E3F0] to-[#DDD4E8]">
      {/* Floating Header - Same as other pages */}
      <Header onScrollToForm={() => formSectionRef.current?.scrollIntoView({ behavior: "smooth" })} />

      {/* Main Content Container with top spacing */}
      <main className="relative pt-32">
        {/* Multi-Step Form Section */}
        <ParatopeMultiStepForm 
          ref={formSectionRef}
          onSubmitSuccess={handleSubmitSuccess}
          onSubmitError={handleSubmitError}
        />

        {/* Citation Section - VASCO specific */}
        <ParatopeCitation />

        {/* Status Modal */}
        <ParatopeSubmissionStatus
          isSubmitted={isSubmitted}
          isError={submitError}
          errorMessage={errorMessage}
          jobId={jobId}
          userId={userId}
          azureUrl={azureUrl}
          onClose={handleCloseStatus}
        />

        <Footer />
      </main>
    </div>
  )
}
