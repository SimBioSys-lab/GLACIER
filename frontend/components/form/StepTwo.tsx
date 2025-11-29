"use client"

import React from "react"
import { User, Mail, Building, FileText, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

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
  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onFormDataChange({
      ...formData,
      [field]: e.target.value,
    })
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-light text-[#1A1A1A]">
          Contact Information
        </h2>
        <p className="text-[#1A1A1A]/70 mt-2">
          Optionally provide your contact details for the analysis results
        </p>
        <p className="text-sm text-[#8B7DFF] font-medium mt-1">
          All fields are optional - you can submit without filling any information
        </p>
      </div>

      {/* Optional Fields Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">Anonymous Submission Allowed</p>
          <p className="mt-1">You can submit your analysis without providing any personal information. All fields on this page are completely optional.</p>
        </div>
      </div>

      {/* Full Name */}
      <div className="space-y-3">
        <Label htmlFor="fullName" className="text-[#1A1A1A] text-lg flex items-center gap-2">
          <User className="w-5 h-5" />
          Full Name
          <span className="text-sm font-normal text-[#1A1A1A]/60">(Optional)</span>
        </Label>
        <Input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          placeholder="Enter your full name"
          className="bg-white/70 border-[#1A1A1A]/20 text-[#1A1A1A] placeholder-[#1A1A1A]/50 text-lg p-4 focus:border-[#8B7DFF] focus:ring-[#8B7DFF]/20"
        />
      </div>

      {/* Email */}
      <div className="space-y-3">
        <Label htmlFor="email" className="text-[#1A1A1A] text-lg flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Address
          <span className="text-sm font-normal text-[#1A1A1A]/60">(Optional)</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          placeholder="your.email@example.com"
          className="bg-white/70 border-[#1A1A1A]/20 text-[#1A1A1A] placeholder-[#1A1A1A]/50 text-lg p-4 focus:border-[#8B7DFF] focus:ring-[#8B7DFF]/20"
        />
        <p className="text-sm text-[#1A1A1A]/60">
          Provide an email if you'd like to receive the analysis results
        </p>
      </div>

      {/* Organization */}
      <div className="space-y-3">
        <Label htmlFor="organization" className="text-[#1A1A1A] text-lg flex items-center gap-2">
          <Building className="w-5 h-5" />
          Organization/Institution
          <span className="text-sm font-normal text-[#1A1A1A]/60">(Optional)</span>
        </Label>
        <Input
          id="organization"
          type="text"
          value={formData.organization}
          onChange={handleChange('organization')}
          placeholder="University or Company Name"
          className="bg-white/70 border-[#1A1A1A]/20 text-[#1A1A1A] placeholder-[#1A1A1A]/50 text-lg p-4 focus:border-[#8B7DFF] focus:ring-[#8B7DFF]/20"
        />
      </div>

      {/* Description */}
      <div className="space-y-3">
        <Label htmlFor="description" className="text-[#1A1A1A] text-lg flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Project Description
          <span className="text-sm font-normal text-[#1A1A1A]/60">(Optional)</span>
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={handleChange('description')}
          placeholder="Brief description of your research project..."
          rows={4}
          className="bg-white/70 border-[#1A1A1A]/20 text-[#1A1A1A] placeholder-[#1A1A1A]/50 text-lg p-4 focus:border-[#8B7DFF] focus:ring-[#8B7DFF]/20 resize-none"
        />
      </div>

      {/* Optional Field Status */}
      <div className="mt-8 p-4 bg-[#F5F4F9]/50 rounded-lg">
        <h4 className="text-sm font-medium text-[#1A1A1A] mb-3">Form Status:</h4>
        <p className="text-sm text-[#1A1A1A]/70 mb-3">All fields are optional. You can submit the form at any time.</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-medium text-white ${
              formData.fullName.trim() ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              {formData.fullName.trim() ? '✓' : ''}
            </span>
            <span className="text-sm text-[#1A1A1A]/70">
              Full Name {formData.fullName.trim() && <span className="text-green-600 text-xs">(Provided)</span>}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-medium text-white ${
              formData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) 
                ? 'bg-green-500' 
                : formData.email.trim()
                ? 'bg-yellow-500'
                : 'bg-gray-300'
            }`}>
              {formData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? '✓' : 
               formData.email.trim() ? '!' : ''}
            </span>
            <span className="text-sm text-[#1A1A1A]/70">
              Email Address {formData.email.trim() && (
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) 
                  ? <span className="text-green-600 text-xs">(Valid)</span>
                  : <span className="text-yellow-600 text-xs">(Invalid format)</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-medium text-white ${
              formData.organization.trim() ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              {formData.organization.trim() ? '✓' : ''}
            </span>
            <span className="text-sm text-[#1A1A1A]/70">
              Organization {formData.organization.trim() && <span className="text-green-600 text-xs">(Provided)</span>}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-medium text-white ${
              formData.description.trim() ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              {formData.description.trim() ? '✓' : ''}
            </span>
            <span className="text-sm text-[#1A1A1A]/70">
              Project Description {formData.description.trim() && <span className="text-green-600 text-xs">(Provided)</span>}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}