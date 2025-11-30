'use client'

import { CheckCircle, AlertCircle, X, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface SubmissionStatusProps {
  isSubmitted: boolean
  isError: boolean
  errorMessage?: string
  jobIds?: string[]
  azureUrl?: string
  onClose: () => void
}

export function SubmissionStatus({ 
  isSubmitted, 
  isError, 
  errorMessage, 
  jobIds,
  azureUrl,
  onClose
}: SubmissionStatusProps) {
  const [copied, setCopied] = useState(false)

  console.log('SubmissionStatus rendered with:', { isSubmitted, isError, jobIds, azureUrl })

  if (!isSubmitted && !isError) return null

  const handleCopy = async () => {
    if (azureUrl) {
      await navigator.clipboard.writeText(azureUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (isError) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
        onClick={handleBackdropClick}
      >
        <div className="bg-white/95 backdrop-blur-md text-[#1A1A1A] p-8 rounded-xl max-w-md w-full shadow-xl border border-red-400/30 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center mb-4">
            <AlertCircle className="text-red-500 mr-3 h-8 w-8" />
            <h3 className="text-xl font-medium">Submission Failed</h3>
          </div>
          <p className="mb-6 text-[#1A1A1A]/80">{errorMessage || "There was an error submitting your request. Please try again later."}</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/95 backdrop-blur-md text-[#1A1A1A] p-8 rounded-xl max-w-lg w-full shadow-xl border border-green-400/30 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center mb-4">
          <CheckCircle className="text-green-600 mr-3 h-8 w-8" />
          <h3 className="text-xl font-medium">Submission Successful</h3>
        </div>
        <p className="mb-6 text-[#1A1A1A]/80">Your files have been uploaded and processing has begun. You will receive an email once processing is complete.</p>
        
        {jobIds && jobIds.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2 text-[#1A1A1A]/70">Job IDs:</h4>
            <div className="bg-[#F5F4F9] p-3 rounded text-xs font-mono overflow-x-auto border border-[#1A1A1A]/10">
              {jobIds.map((id, index) => (
                <div key={index} className="mb-1">{id}</div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 text-[#1A1A1A]/70">Results URL:</h4>
          {azureUrl ? (
            <>
              <p className="text-xs text-[#1A1A1A]/60 mb-2">
                Save this link to access your results once processing is complete. Results will be uploaded to this URL.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-[#F5F4F9] p-3 rounded text-xs font-mono overflow-x-auto border border-[#1A1A1A]/10">
                  <a 
                    href={azureUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {azureUrl}
                  </a>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-2 bg-[#1A1A1A] text-white rounded hover:bg-[#1A1A1A]/90 transition-colors text-sm whitespace-nowrap"
                  title="Copy URL"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <p className="text-xs text-[#1A1A1A]/60">
              Results URL is being generated... Please check your email for the link.
            </p>
          )}
        </div>
        
        <div className="text-sm text-[#1A1A1A]/60 mt-4 italic">
          Click outside or press X to close this message.
        </div>
      </div>
    </div>
  )
}