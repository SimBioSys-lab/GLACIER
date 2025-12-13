"use client"

import React, { forwardRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import StepIndicator from "@/components/form/StepIndicator"
import ParatopeStepOne from "./ParatopeStepOne"
import StepTwo from "@/components/form/StepTwo"
import type { FormData } from "@/components/form/StepTwo"

interface ParatopeMultiStepFormProps {
  onSubmitSuccess: (jobId: string, userId: string, azureUrl?: string) => void
  onSubmitError: (error: string) => void
}

const ParatopeMultiStepForm = forwardRef<HTMLDivElement, ParatopeMultiStepFormProps>(
  ({ onSubmitSuccess, onSubmitError }, ref) => {
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Step 1: File uploads and chain IDs
    const [antibodyFile, setAntibodyFile] = useState<File | null>(null)
    const [antigenFile, setAntigenFile] = useState<File | null>(null)
    const [lightChain, setLightChain] = useState("L")
    const [heavyChain, setHeavyChain] = useState("H")
    const [antigenChains, setAntigenChains] = useState("")

    // Step 2: Personal information
    const [formData, setFormData] = useState<FormData>({
      fullName: "",
      email: "",
      organization: "",
      description: "",
    })

    // Navigation
    const nextStep = () => {
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1)
      }
    }

    const prevStep = () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1)
      }
    }

    // Validation
    const canProceedToStepTwo = antibodyFile !== null && antigenFile !== null

    const canSubmit = () => {
      // Files are required, personal info is optional
      return antibodyFile !== null && antigenFile !== null
    }

    // Submission
    const handleSubmit = async () => {
      if (!canSubmit()) {
        onSubmitError("Please upload both antibody and antigen PDB files")
        return
      }

      setIsSubmitting(true)

      try {
        const formDataToSend = new FormData()
        
        formDataToSend.append('antibody_file', antibodyFile!)
        formDataToSend.append('antigen_file', antigenFile!)
        formDataToSend.append('light_chain', lightChain)
        formDataToSend.append('heavy_chain', heavyChain)
        formDataToSend.append('antigen_chains', antigenChains)
        formDataToSend.append('name', formData.fullName)
        formDataToSend.append('email', formData.email)
        formDataToSend.append('organization', formData.organization)
        formDataToSend.append('description', formData.description)

        // TODO: Replace with actual API endpoint when backend is ready
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const response = await fetch(`${API_URL}/vasco/upload`, {
          method: 'POST',
          body: formDataToSend,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ 
            detail: 'An error occurred during submission' 
          }))
          throw new Error(errorData.detail || 'Submission failed')
        }

        const result = await response.json()
        
        setIsSubmitting(false)
        console.log('VASCO submission result:', result)
        onSubmitSuccess(result.job_id, result.user_id, result.azure_folder_url)

        // Reset form after success
        setTimeout(() => {
          setAntibodyFile(null)
          setAntigenFile(null)
          setLightChain("L")
          setHeavyChain("H")
          setAntigenChains("")
          setFormData({
            fullName: "",
            email: "",
            organization: "",
            description: "",
          })
          setCurrentStep(1)
          window.scrollTo({ top: 0, behavior: "smooth" })
        }, 5000)

      } catch (error: any) {
        console.error('Error submitting paratope prediction:', error)
        setIsSubmitting(false)
        onSubmitError(error.message || 'An unknown error occurred')
      }
    }

    return (
      <section ref={ref} className="relative min-h-screen bg-white">
        <div className="container mx-auto px-6 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF7D8B] to-[#8B7DFF] bg-clip-text text-transparent">
              VASCO Analysis
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Viral Antibody Structural Complex Analysis - AI-powered interface prediction
            </p>
          </div>

          {/* Form Card */}
          <div className="w-full max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border border-[#1A1A1A]/10 rounded-2xl shadow-xl">
              <CardContent className="p-8">
                {/* Step Indicator */}
                <StepIndicator currentStep={currentStep} />

                {/* Form Content */}
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ParatopeStepOne
                        antibodyFile={antibodyFile}
                        antigenFile={antigenFile}
                        lightChain={lightChain}
                        heavyChain={heavyChain}
                        antigenChains={antigenChains}
                        onAntibodyChange={setAntibodyFile}
                        onAntigenChange={setAntigenFile}
                        onLightChainChange={setLightChain}
                        onHeavyChainChange={setHeavyChain}
                        onAntigenChainsChange={setAntigenChains}
                      />
                    </motion.div>
                  )}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <StepTwo
                        formData={formData}
                        onFormDataChange={setFormData}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {currentStep < 2 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!canProceedToStepTwo}
                      className="bg-[#FF7D8B] hover:bg-[#FF6D7B] text-white flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!canSubmit() || isSubmitting}
                      className="bg-gradient-to-r from-[#FF7D8B] to-[#8B7DFF] hover:from-[#FF6D7B] hover:to-[#7B6DFF] text-white flex items-center gap-2 min-w-[140px]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Analysis'
                      )}
                    </Button>
                  )}
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center text-sm text-gray-500">
                  {currentStep === 1 && !canProceedToStepTwo && (
                    <p>Upload both antibody and antigen PDB files to continue</p>
                  )}
                  {currentStep === 2 && (
                    <p>Personal information is optional. Click Submit to start the analysis.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-800">Upload Files</h3>
              </div>
              <p className="text-sm text-gray-600">
                Provide antibody and antigen PDB structures with chain IDs
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-800">Deep Learning</h3>
              </div>
              <p className="text-sm text-gray-600">
                MSA generation + graph neural networks predict interface residues
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-800">Get Results</h3>
              </div>
              <p className="text-sm text-gray-600">
                Receive predictions and visualizations via email in 4-8 hours
              </p>
            </Card>
          </div>
        </div>
      </section>
    )
  }
)

ParatopeMultiStepForm.displayName = "ParatopeMultiStepForm"

export default ParatopeMultiStepForm
