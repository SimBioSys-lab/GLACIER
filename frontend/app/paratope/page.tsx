"use client"

import React, { useState, useRef } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import ParatopeMultiStepForm from "@/components/paratope-form/ParatopeMultiStepForm"
import ParatopeCitation from "@/components/citation/ParatopeCitation"

export default function ParatopePage() {
  const [submitError, setSubmitError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [jobId, setJobId] = useState<string>()
  const [userId, setUserId] = useState<string>()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const formSectionRef = useRef<HTMLDivElement>(null)

  const handleSubmitSuccess = (jobId: string, userId: string) => {
    setJobId(jobId)
    setUserId(userId)
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

        {/* Citation Section - Paratope specific */}
        <ParatopeCitation />

        {/* Status Messages */}
        {isSubmitted && jobId && userId && (
          <div className="container mx-auto px-6 py-8">
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-green-800 mb-2">Submission Successful!</h3>
                  <div className="space-y-2 text-green-700">
                    <p className="font-mono text-sm">
                      <span className="font-semibold">Job ID:</span> {jobId}
                    </p>
                    <p className="font-mono text-sm">
                      <span className="font-semibold">User ID:</span> {userId}
                    </p>
                  </div>
                  <div className="mt-6 p-4 bg-white/50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 font-medium mb-2">⏱️ Processing Timeline</p>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• <span className="font-medium">Total time:</span> 4-8 hours</li>
                      <li>• <span className="font-medium">MSA generation:</span> 2-4 hours (slowest step)</li>
                      <li>• <span className="font-medium">Prediction:</span> 30-60 minutes (GPU)</li>
                    </ul>
                  </div>
                  <p className="mt-4 text-sm text-green-600">
                    📧 You will receive an email when the analysis is complete.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {submitError && (
          <div className="container mx-auto px-6 py-8">
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-red-800 mb-2">Submission Failed</h3>
                  <p className="text-red-700">{errorMessage}</p>
                  <p className="mt-4 text-sm text-red-600">
                    Please check your files and try again. If the problem persists, contact support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </main>
    </div>
  )
}
