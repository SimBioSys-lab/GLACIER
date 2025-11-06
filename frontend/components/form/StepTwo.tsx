"use client"

import React from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FlaskRound } from "lucide-react"
import { EXAMPLE_DATA } from "@/services/exampleDataService"

export interface FormData {
  fullName: string
  email: string
  organization: string
  description: string
}

interface StepTwoProps {
  formData: FormData
  onFormDataChange: (data: FormData) => void
}

export default function StepTwo({ formData, onFormDataChange }: StepTwoProps) {
  // Check if this is example data by looking at the organization and description
  const isExampleData = formData.organization === EXAMPLE_DATA.formData.organization && 
                       formData.description === EXAMPLE_DATA.formData.description;

  return (
    <motion.div
      key="step2"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-light text-[#1A1A1A] mb-4">
          Personal Details
        </h2>
        <p className="text-[#1A1A1A]/70">
          Tell us about yourself and your research
        </p>
        <p className="text-sm text-[#1A1A1A]/50 mt-2">
          * Full Name, Email, and Organization are required
        </p>
      </div>

      {/* Example Data Notice */}
      {isExampleData && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#8B7DFF]/10 to-blue-500/10 border border-[#8B7DFF]/30 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <FlaskRound className="w-5 h-5 text-[#8B7DFF]" />
            <div>
              <h4 className="text-sm font-medium text-[#1A1A1A]">
                Example Form Data
              </h4>
              <p className="text-xs text-[#1A1A1A]/70 mt-1">
                These are placeholder values for demonstration. Feel free to modify them or use your own information.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-[#1A1A1A] text-lg">Full Name *</Label>
          <Input
            value={formData.fullName}
            onChange={(e) => onFormDataChange({ ...formData, fullName: e.target.value })}
            className="bg-white/70 border-[#1A1A1A]/20 text-[#1A1A1A] placeholder-[#1A1A1A]/50 text-lg p-4 focus:border-[#8B7DFF] focus:ring-[#8B7DFF]/20"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="space-y-3">
          <Label className="text-[#1A1A1A] text-lg">Email Address *</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
            className="bg-white/70 border-[#1A1A1A]/20 text-[#1A1A1A] placeholder-[#1A1A1A]/50 text-lg p-4 focus:border-[#8B7DFF] focus:ring-[#8B7DFF]/20"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-[#1A1A1A] text-lg">Organization *</Label>
        <Input
          value={formData.organization}
          onChange={(e) => onFormDataChange({ ...formData, organization: e.target.value })}
          className="bg-white/70 border-[#1A1A1A]/20 text-[#1A1A1A] placeholder-[#1A1A1A]/50 text-lg p-4 focus:border-[#8B7DFF] focus:ring-[#8B7DFF]/20"
          placeholder="Enter your organization"
          required
        />
      </div>

      <div className="space-y-3">
        <Label className="text-[#1A1A1A] text-lg">Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
          className="bg-white/70 border-[#1A1A1A]/20 text-[#1A1A1A] placeholder-[#1A1A1A]/50 min-h-[120px] text-lg p-4 focus:border-[#8B7DFF] focus:ring-[#8B7DFF]/20"
          placeholder="Briefly describe your uploaded files and research goals"
        />
      </div>
    </motion.div>
  )
}
