'use client'

import { CheckCircle, AlertCircle, X, Clock, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface ParatopeSubmissionStatusProps {
  isSubmitted: boolean
  isError: boolean
  errorMessage?: string
  jobId?: string
  userId?: string
  azureUrl?: string
  onClose: () => void
}

export function ParatopeSubmissionStatus({ 
  isSubmitted, 
  isError, 
  errorMessage, 
  jobId,
  userId,
  azureUrl,
  onClose
}: ParatopeSubmissionStatusProps) {
  const [copied, setCopied] = useState(false)

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
          <p className="mb-4 text-[#1A1A1A]/80">{errorMessage || "There was an error submitting your request. Please try again later."}</p>
          <p className="text-sm text-[#1A1A1A]/60">
            Please check your files and try again. If the problem persists, contact support.
          </p>
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
          <h3 className="text-xl font-medium">Submission Successful!</h3>
        </div>
        
        {jobId && userId && (
          <div className="mb-6 space-y-2">
            <div className="bg-[#F5F4F9] p-3 rounded border border-[#1A1A1A]/10">
              <p className="text-sm font-mono text-[#1A1A1A]">
                <span className="font-semibold text-[#1A1A1A]/70">Job ID:</span> {jobId}
              </p>
            </div>
            <div className="bg-[#F5F4F9] p-3 rounded border border-[#1A1A1A]/10">
              <p className="text-sm font-mono text-[#1A1A1A]">
                <span className="font-semibold text-[#1A1A1A]/70">User ID:</span> {userId}
              </p>
            </div>
          </div>
        )}

        {/* Results URL Section */}
        <div className="mb-6">
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

        <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <p className="text-sm font-semibold text-blue-800">Processing Timeline</p>
          </div>
          <ul className="text-sm text-blue-700 space-y-1.5">
            <li>• <span className="font-medium">Total time:</span> 4-8 hours</li>
            <li>• <span className="font-medium">MSA generation:</span> 2-4 hours (slowest step)</li>
            <li>• <span className="font-medium">Prediction:</span> 30-60 minutes (GPU)</li>
          </ul>
        </div>

        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-700 flex items-center gap-2">
            <span className="text-lg">📧</span>
            <span>You will receive an email when the analysis is complete.</span>
          </p>
        </div>
        
        <div className="text-sm text-[#1A1A1A]/60 italic text-center">
          Click outside or press X to close this message.
        </div>
      </div>
    </div>
  )
}
