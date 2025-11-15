'use client'

import React, { useState } from 'react'
import { Info, X, ChevronRight, Server, Cpu, FileCode, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'workflow'>('overview')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed left-1/2 top-[10vh] -translate-x-1/2 w-[90vw] max-w-4xl max-h-[80vh] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#8B7DFF]/10 to-[#1A1A1A]/10 border-b border-[#1A1A1A]/10 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-[#1A1A1A]">
                  GLACIER Pipeline
                </h2>
                <button
                  onClick={onClose}
                  className="text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors p-2 hover:bg-[#1A1A1A]/10 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'overview'
                      ? 'bg-[#8B7DFF] text-white'
                      : 'text-[#1A1A1A]/60 hover:bg-[#1A1A1A]/5'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('technical')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'technical'
                      ? 'bg-[#8B7DFF] text-white'
                      : 'text-[#1A1A1A]/60 hover:bg-[#1A1A1A]/5'
                  }`}
                >
                  Technical Details
                </button>
                <button
                  onClick={() => setActiveTab('workflow')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'workflow'
                      ? 'bg-[#8B7DFF] text-white'
                      : 'text-[#1A1A1A]/60 hover:bg-[#1A1A1A]/5'
                  }`}
                >
                  Workflow
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-[#8B7DFF]" />
                      Required Files
                    </h3>
                    <div className="bg-[#F5F4F9]/50 rounded-lg p-4 space-y-3">
                      <p className="text-sm text-[#1A1A1A]/70">
                        Each folder you upload must contain the following four files:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-[#8B7DFF] mt-0.5">•</span>
                          <div>
                            <span className="font-medium text-[#1A1A1A]">.pdb file:</span>
                            <span className="text-[#1A1A1A]/70 ml-2">
                              Protein structure file containing atomic coordinates
                            </span>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#8B7DFF] mt-0.5">•</span>
                          <div>
                            <span className="font-medium text-[#1A1A1A]">.ali file:</span>
                            <span className="text-[#1A1A1A]/70 ml-2">
                              Sequence alignment file for ensemble modeling
                            </span>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#8B7DFF] mt-0.5">•</span>
                          <div>
                            <span className="font-medium text-[#1A1A1A]">glyc.dat:</span>
                            <span className="text-[#1A1A1A]/70 ml-2">
                              Glycan chain configuration and parameters
                            </span>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#8B7DFF] mt-0.5">•</span>
                          <div>
                            <span className="font-medium text-[#1A1A1A]">input.dat:</span>
                            <span className="text-[#1A1A1A]/70 ml-2">
                              AllosMod configuration parameters
                            </span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3">
                      What Happens to Your Data
                    </h3>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <ol className="space-y-3 text-sm">
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-[#8B7DFF] text-white rounded-full flex items-center justify-center text-xs font-medium">
                            1
                          </span>
                          <div className="text-[#1A1A1A]/80">
                            <span className="font-medium">Upload & Validation:</span> Files are uploaded to our FastAPI backend and validated for completeness
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-[#8B7DFF] text-white rounded-full flex items-center justify-center text-xs font-medium">
                            2
                          </span>
                          <div className="text-[#1A1A1A]/80">
                            <span className="font-medium">HPC Transfer:</span> Files are securely transferred to Northeastern University's HPC cluster
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-[#8B7DFF] text-white rounded-full flex items-center justify-center text-xs font-medium">
                            3
                          </span>
                          <div className="text-[#1A1A1A]/80">
                            <span className="font-medium">Processing:</span> Ensemble modeling and GEF analysis run on high-performance computing resources
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-[#8B7DFF] text-white rounded-full flex items-center justify-center text-xs font-medium">
                            4
                          </span>
                          <div className="text-[#1A1A1A]/80">
                            <span className="font-medium">Notification:</span> You receive email updates when processing starts and completes
                          </div>
                        </li>
                      </ol>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'technical' && (
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                      <Server className="w-5 h-5 text-[#8B7DFF]" />
                      Infrastructure
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-[#F5F4F9]/50 rounded-lg p-4">
                        <h4 className="font-medium text-[#1A1A1A] mb-2">Frontend</h4>
                        <ul className="text-sm text-[#1A1A1A]/70 space-y-1">
                          <li>• Next.js 14 with React 18</li>
                          <li>• TypeScript for type safety</li>
                          <li>• Glassmorphism UI with Framer Motion</li>
                          <li>• Progressive enhancement patterns</li>
                        </ul>
                      </div>
                      <div className="bg-[#F5F4F9]/50 rounded-lg p-4">
                        <h4 className="font-medium text-[#1A1A1A] mb-2">Backend</h4>
                        <ul className="text-sm text-[#1A1A1A]/70 space-y-1">
                          <li>• Python FastAPI on Render.com</li>
                          <li>• SSH connection to HPC cluster</li>
                          <li>• SLURM job scheduling system</li>
                          <li>• Gmail SMTP for notifications</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-[#8B7DFF]" />
                      Computational Pipeline
                    </h3>
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 space-y-3">
                      <div>
                        <h4 className="font-medium text-[#1A1A1A] mb-1">1. AllosMod Ensemble Generation</h4>
                        <p className="text-sm text-[#1A1A1A]/70">
                          GPU-accelerated molecular dynamics to generate protein conformational ensembles (typically 995 frames)
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-[#1A1A1A] mb-1">2. Trajectory Alignment</h4>
                        <p className="text-sm text-[#1A1A1A]/70">
                          VMD-based alignment with precise residue numbering preservation for multi-chain systems
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-[#1A1A1A] mb-1">3. GEF Analysis</h4>
                        <p className="text-sm text-[#1A1A1A]/70">
                          Geometric Exposure Factor calculation using 3×3 matrix approach (3 protomers × 3 directions)
                        </p>
                        <p className="text-xs text-[#1A1A1A]/60 mt-1">
                          Runtime: 4-6 hours (optimized from 30+ hours)
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-[#1A1A1A] mb-1">4. Visualization Generation</h4>
                        <p className="text-sm text-[#1A1A1A]/70">
                          Envelope graphs with statistical analysis and ensemble shading
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3">
                      HPC Resources
                    </h3>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <ul className="text-sm text-[#1A1A1A]/80 space-y-2">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-green-600" />
                          <div>
                            <span className="font-medium">Cluster:</span> explorer.northeastern.edu
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-green-600" />
                          <div>
                            <span className="font-medium">Partition:</span> "short" (up to 48 hours runtime)
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-green-600" />
                          <div>
                            <span className="font-medium">Resources:</span> 1024 cores, 25TB RAM available
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-green-600" />
                          <div>
                            <span className="font-medium">Software:</span> VMD/1.9.4a55, allosmod-env
                          </div>
                        </li>
                      </ul>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'workflow' && (
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3">
                      Complete Processing Workflow
                    </h3>
                    <div className="space-y-4">
                      {/* Workflow steps */}
                      <div className="relative">
                        {/* Connection line */}
                        <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-[#8B7DFF]/20" />
                        
                        {/* Steps */}
                        <div className="space-y-6">
                          <WorkflowStep
                            number={1}
                            title="File Upload & Validation"
                            description="Multi-folder upload with automatic validation for required files"
                            details={[
                              "Preserves folder structure for batch processing",
                              "Validates PDB, ALI, glyc.dat, and input.dat presence",
                              "Dynamic prefix detection for different PDB patterns"
                            ]}
                          />
                          
                          <WorkflowStep
                            number={2}
                            title="Backend Processing"
                            description="FastAPI backend handles file organization and HPC submission"
                            details={[
                              "Creates timestamped job directories",
                              "Transfers files via SSH to HPC cluster",
                              "Submits SLURM jobs with proper dependencies"
                            ]}
                          />
                          
                          <WorkflowStep
                            number={3}
                            title="AllosMod Ensemble"
                            description="Generates conformational ensemble using molecular dynamics"
                            details={[
                              "GPU-accelerated processing",
                              "Produces ~995 frames per structure",
                              "Preserves glycan chain distribution"
                            ]}
                          />
                          
                          <WorkflowStep
                            number={4}
                            title="Alignment & Analysis"
                            description="VMD alignment followed by parallel GEF computation"
                            details={[
                              "Maintains original residue numbering",
                              "3×3 matrix approach for surface exposure",
                              "Parallel processing reduces runtime by 80%"
                            ]}
                          />
                          
                          <WorkflowStep
                            number={5}
                            title="Results & Notification"
                            description="Email notification with secure download links"
                            details={[
                              "Job completion email with results summary",
                              "Envelope graphs with statistical analysis",
                              "Comprehensive output files for further analysis"
                            ]}
                            isLast
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="mt-8">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-[#1A1A1A] mb-1">
                            Email Notifications
                          </h4>
                          <p className="text-sm text-[#1A1A1A]/70">
                            You'll receive emails at two stages:
                          </p>
                          <ul className="text-sm text-[#1A1A1A]/70 mt-2 space-y-1">
                            <li>• Job submission acknowledgment with job IDs</li>
                            <li>• Completion notification with download links</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#1A1A1A]/10 px-6 py-4 bg-[#F5F4F9]/30">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#1A1A1A]/60">
                  GLACIER - Computational Biology Platform for SimBioSys Lab
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-[#8B7DFF] text-white rounded-lg hover:bg-[#8B7DFF]/90 transition-colors text-sm font-medium"
                >
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Workflow Step Component
function WorkflowStep({ 
  number, 
  title, 
  description, 
  details,
  isLast = false 
}: { 
  number: number
  title: string
  description: string
  details: string[]
  isLast?: boolean
}) {
  return (
    <div className="relative flex gap-4">
      {/* Step number */}
      <div className={`flex-shrink-0 w-12 h-12 bg-[#8B7DFF] text-white rounded-full flex items-center justify-center font-semibold z-10 ${
        isLast ? 'ring-4 ring-[#8B7DFF]/20' : ''
      }`}>
        {number}
      </div>
      
      {/* Content */}
      <div className="flex-1 pb-6">
        <h4 className="font-semibold text-[#1A1A1A] mb-1">{title}</h4>
        <p className="text-sm text-[#1A1A1A]/70 mb-3">{description}</p>
        <ul className="text-xs text-[#1A1A1A]/60 space-y-1">
          {details.map((detail, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-[#8B7DFF] mt-0.5">→</span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Info Button Component
export function InfoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#8B7DFF]/10 hover:bg-[#8B7DFF]/20 transition-colors group"
      aria-label="More information about the upload process"
    >
      <Info className="w-4 h-4 text-[#8B7DFF] group-hover:scale-110 transition-transform" />
    </button>
  )
}
