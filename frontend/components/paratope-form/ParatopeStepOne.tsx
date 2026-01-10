"use client"

import React, { useState } from "react"
import { Upload, FileText, Info, X, ChevronDown, ChevronRight, BookOpen, AlertTriangle, Zap, FlaskRound, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { loadVascoExampleFiles, isVascoExampleData, VASCO_EXAMPLE_DATA } from "@/services/vascoExampleDataService"

interface ParatopeStepOneProps {
  antibodyFile: File | null
  antigenFile: File | null
  lightChain: string
  heavyChain: string
  antigenChains: string
  onAntibodyChange: (file: File | null) => void
  onAntigenChange: (file: File | null) => void
  onLightChainChange: (chain: string) => void
  onHeavyChainChange: (chain: string) => void
  onAntigenChainsChange: (chains: string) => void
}

export default function ParatopeStepOne({
  antibodyFile,
  antigenFile,
  lightChain,
  heavyChain,
  antigenChains,
  onAntibodyChange,
  onAntigenChange,
  onLightChainChange,
  onHeavyChainChange,
  onAntigenChainsChange,
}: ParatopeStepOneProps) {
  const [dragActive, setDragActive] = useState<'antibody' | 'antigen' | null>(null)
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set())
  const [isLoadingExample, setIsLoadingExample] = useState(false)
  const [isExample, setIsExample] = useState(false)

  // Helper function to download example files
  const downloadExampleFiles = () => {
    const files = [
      { url: '/examples/2B4C/antibody.pdb', name: 'antibody.pdb' },
      { url: '/examples/2B4C/antigen.pdb', name: 'antigen.pdb' }
    ]
    files.forEach((file, index) => {
      setTimeout(() => {
        const a = document.createElement('a')
        a.href = file.url
        a.download = file.name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }, index * 300)
    })
  }

  // Load example files
  const handleLoadExample = async () => {
    setIsLoadingExample(true)
    try {
      const exampleData = await loadVascoExampleFiles()
      onAntibodyChange(exampleData.antibodyFile)
      onAntigenChange(exampleData.antigenFile)
      onLightChainChange(exampleData.lightChain)
      onHeavyChainChange(exampleData.heavyChain)
      onAntigenChainsChange(exampleData.antigenChains)
      setIsExample(true)
      console.log('VASCO example files loaded successfully')
    } catch (error) {
      console.error('Failed to load example files:', error)
      alert('Failed to load example files. Please try again.')
    } finally {
      setIsLoadingExample(false)
    }
  }

  // Clear example data
  const clearExample = () => {
    onAntibodyChange(null)
    onAntigenChange(null)
    onLightChainChange('L')
    onHeavyChainChange('H')
    onAntigenChainsChange('')
    setIsExample(false)
  }

  const toggleDocSection = (section: string) => {
    setExpandedDocs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  const handleDrag = (e: React.DragEvent, type: 'antibody' | 'antigen') => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(type)
    } else if (e.type === "dragleave") {
      setDragActive(null)
    }
  }

  const handleDrop = (e: React.DragEvent, type: 'antibody' | 'antigen') => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(null)

    const file = e.dataTransfer.files?.[0]
    if (file && file.name.toLowerCase().endsWith('.pdb')) {
      if (type === 'antibody') {
        onAntibodyChange(file)
      } else {
        onAntigenChange(file)
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'antibody' | 'antigen') => {
    const file = e.target.files?.[0]
    if (file && file.name.toLowerCase().endsWith('.pdb')) {
      if (type === 'antibody') {
        onAntibodyChange(file)
      } else {
        onAntigenChange(file)
      }
    }
  }

  const removeFile = (type: 'antibody' | 'antigen') => {
    if (type === 'antibody') {
      onAntibodyChange(null)
    } else {
      onAntigenChange(null)
    }
    // If removing a file, clear example state
    if (isExample) {
      setIsExample(false)
    }
  }

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#FF7D8B] to-[#8B7DFF] bg-clip-text text-transparent">
          Upload Structures for VASCO
        </h2>
        <p className="text-gray-600">
          Upload antibody and antigen PDB files. VASCO uses MSA-powered neural networks to predict interface residues.
        </p>
      </div>

      {/* Example Data Banner */}
      {isExample && (
        <div className="bg-gradient-to-r from-[#FF6B9D]/10 to-[#8B7DFF]/10 border border-[#FF6B9D]/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FlaskRound className="w-5 h-5 text-[#FF6B9D]" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-[#1A1A1A]">
                Viewing Example Data: {VASCO_EXAMPLE_DATA.name}
              </h4>
              <p className="text-xs text-[#1A1A1A]/70 mt-1">
                {VASCO_EXAMPLE_DATA.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={downloadExampleFiles}
                  className="bg-[#FF6B9D] hover:bg-[#FF6B9D]/90 text-white text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download Example Files
                </Button>
                <p className="text-xs text-[#1A1A1A]/60">
                  Download both PDB files to your computer
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearExample}
              className="text-xs text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
            >
              Clear Example
            </Button>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Required files:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Antibody PDB</strong>: Must contain Light (L) and Heavy (H) chains</li>
              <li><strong>Antigen PDB</strong>: One or more antigen chains</li>
              <li>Both files must be in standard PDB format</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Processing Time Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-amber-800">
          <p className="font-medium">Processing Time & Results</p>
          <p className="mt-1">VASCO analysis typically completes within 4-8 hours. This includes MSA generation, deep learning inference, and result visualization. A results link will be provided immediately upon submission where you can check the status and access your results once ready.</p>
        </div>
      </div>

      {/* Documentation Section - Collapsible */}
      <div className="border border-[#1A1A1A]/10 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleDocSection('documentation')}
          className="w-full flex items-center justify-between p-4 bg-[#F5F4F9]/50 hover:bg-[#F5F4F9] transition-colors"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-[#FF6B9D]" />
            <span className="font-medium text-[#1A1A1A]">VASCO Documentation & Input Requirements</span>
          </div>
          {expandedDocs.has('documentation') ? (
            <ChevronDown className="w-5 h-5 text-[#1A1A1A]/60" />
          ) : (
            <ChevronRight className="w-5 h-5 text-[#1A1A1A]/60" />
          )}
        </button>
        
        {expandedDocs.has('documentation') && (
          <div className="p-4 bg-white space-y-6 text-sm text-[#1A1A1A]/80">
            {/* Overview */}
            <div>
              <h4 className="font-semibold text-[#1A1A1A] mb-2">What is VASCO?</h4>
              <p className="leading-relaxed">
                VASCO (Viral Antibody Structural Complex Analysis) is a structure-based computational platform for predicting antibody–antigen binding interfaces. It identifies both paratope residues on antibodies and epitope residues on antigens, providing rapid, interpretable insights into molecular recognition that can guide experimental design, antibody engineering, and vaccine development.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#1A1A1A] mb-2">How It Works</h4>
              <p className="leading-relaxed">
                VASCO integrates sequence-derived features, structural context, and learned attention and masking mechanisms. The model uses graph neural networks trained on known antibody-antigen complexes to predict binding probability scores for each residue. Because it integrates multiple types of information, its predictions are not only accurate but also biophysically interpretable.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#1A1A1A] mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FF6B9D]" />
                What You Get
              </h4>
              <div className="bg-[#F5F4F9]/50 p-3 rounded-lg">
                <ul className="list-disc list-inside space-y-1 text-[#1A1A1A]/70">
                  <li>Binding probability scores for each residue on antibody and antigen</li>
                  <li>Identification of likely paratope and epitope residues</li>
                  <li>Relative importance of residues derived from learned masking mechanisms</li>
                  <li>Visualizations directly mappable to protein structures</li>
                </ul>
              </div>
            </div>

            {/* Antibody PDB documentation */}
            <div className="border-t border-[#1A1A1A]/10 pt-4">
              <h4 className="font-semibold text-[#FF6B9D] mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Required Input: Antibody PDB
              </h4>
              <p className="leading-relaxed mb-3">
                The antibody Fab structure containing the heavy and light chains.
              </p>
              <div className="bg-[#F5F4F9]/50 p-3 rounded-lg space-y-2">
                <p className="font-medium text-[#1A1A1A]">Requirements:</p>
                <ul className="list-disc list-inside space-y-1 text-[#1A1A1A]/70">
                  <li>Standard PDB format file</li>
                  <li>Must contain <strong>Heavy Chain (H)</strong> - typically chain ID "H"</li>
                  <li>Must contain <strong>Light Chain (L)</strong> - typically chain ID "L"</li>
                  <li>Can be experimentally determined (X-ray, cryo-EM, NMR) or computationally predicted (AlphaFold, homology modeling)</li>
                </ul>
              </div>
              <div className="mt-3 bg-orange-50 border border-orange-200 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-orange-800">Important: Chain IDs</p>
                    <p className="text-orange-700 text-xs mt-1">
                      Ensure you specify the correct chain IDs for heavy and light chains. The default is H for heavy and L for light, but your PDB may use different identifiers. Check your PDB file to confirm.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Antigen PDB documentation */}
            <div className="border-t border-[#1A1A1A]/10 pt-4">
              <h4 className="font-semibold text-[#FF6B9D] mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Required Input: Antigen PDB
              </h4>
              <p className="leading-relaxed mb-3">
                The antigen structure corresponding to the viral protein of interest.
              </p>
              <div className="bg-[#F5F4F9]/50 p-3 rounded-lg space-y-2">
                <p className="font-medium text-[#1A1A1A]">Requirements:</p>
                <ul className="list-disc list-inside space-y-1 text-[#1A1A1A]/70">
                  <li>Standard PDB format file</li>
                  <li>Can contain single or multiple chains</li>
                  <li>Specify antigen chain IDs if the structure contains multiple chains</li>
                  <li>Can be experimentally determined or computationally predicted</li>
                </ul>
              </div>
            </div>

            {/* Use Cases */}
            <div className="border-t border-[#1A1A1A]/10 pt-4">
              <h4 className="font-semibold text-[#1A1A1A] mb-2">Use Cases</h4>
              <div className="bg-[#F5F4F9]/50 p-3 rounded-lg">
                <ul className="list-disc list-inside space-y-2 text-[#1A1A1A]/70">
                  <li><strong>Prediction:</strong> Identify likely binding interfaces for new antibody–antigen pairs</li>
                  <li><strong>Screening:</strong> Compare multiple antibodies or antigen variants to prioritize candidates</li>
                  <li><strong>Hypothesis generation:</strong> Suggest mutations, validate experimental observations, or explore alternative binding modes</li>
                  <li><strong>Vaccine design:</strong> Identify epitope regions for immunogen development</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Try Example Run - shown when no files uploaded */}
      {!antibodyFile && !antigenFile && (
        <div className="text-center">
          <button
            onClick={handleLoadExample}
            disabled={isLoadingExample}
            className="text-[#FF6B9D] hover:text-[#FF6B9D]/80 underline text-sm transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isLoadingExample ? (
              <>
                <span className="animate-spin">⏳</span>
                Loading example...
              </>
            ) : (
              <>
                <FlaskRound className="w-4 h-4" />
                Try an example run
              </>
            )}
          </button>
        </div>
      )}

      {/* Antibody Upload */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="antibody" className="text-lg font-semibold flex items-center gap-2">
            <span className="text-[#FF7D8B]">①</span> Antibody Structure (L + H chains)
          </Label>
          <p className="text-sm text-gray-500 mb-3">Upload PDB file containing antibody light and heavy chains</p>
          
          <div
            onDragEnter={(e) => handleDrag(e, 'antibody')}
            onDragLeave={(e) => handleDrag(e, 'antibody')}
            onDragOver={(e) => handleDrag(e, 'antibody')}
            onDrop={(e) => handleDrop(e, 'antibody')}
            className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
              dragActive === 'antibody'
                ? 'border-[#FF7D8B] bg-pink-50'
                : antibodyFile
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-[#FF7D8B] bg-white'
            }`}
          >
            <input
              id="antibody"
              type="file"
              accept=".pdb"
              onChange={(e) => handleFileInput(e, 'antibody')}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {!antibodyFile ? (
              <div className="flex flex-col items-center justify-center text-center">
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Drop antibody PDB here or click to browse
                </p>
                <p className="text-xs text-gray-500">Supports .pdb files only</p>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">{antibodyFile.name}</p>
                    <p className="text-xs text-green-600">
                      {(antibodyFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile('antibody')
                  }}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-red-600" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chain ID inputs for antibody */}
        {antibodyFile && (
          <Card className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">Antibody Chain Configuration</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lchain" className="text-sm">Light Chain ID</Label>
                <Input
                  id="lchain"
                  value={lightChain}
                  onChange={(e) => onLightChainChange(e.target.value.toUpperCase())}
                  placeholder="L"
                  maxLength={1}
                  className="mt-1 font-mono text-center text-lg"
                />
              </div>
              <div>
                <Label htmlFor="hchain" className="text-sm">Heavy Chain ID</Label>
                <Input
                  id="hchain"
                  value={heavyChain}
                  onChange={(e) => onHeavyChainChange(e.target.value.toUpperCase())}
                  placeholder="H"
                  maxLength={1}
                  className="mt-1 font-mono text-center text-lg"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Most antibodies use L and H. Check your PDB file if different.
            </p>
          </Card>
        )}
      </div>

      {/* Antigen Upload */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="antigen" className="text-lg font-semibold flex items-center gap-2">
            <span className="text-[#8B7DFF]">②</span> Antigen Structure
          </Label>
          <p className="text-sm text-gray-500 mb-3">Upload PDB file containing antigen chain(s)</p>
          
          <div
            onDragEnter={(e) => handleDrag(e, 'antigen')}
            onDragLeave={(e) => handleDrag(e, 'antigen')}
            onDragOver={(e) => handleDrag(e, 'antigen')}
            onDrop={(e) => handleDrop(e, 'antigen')}
            className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
              dragActive === 'antigen'
                ? 'border-[#8B7DFF] bg-purple-50'
                : antigenFile
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-[#8B7DFF] bg-white'
            }`}
          >
            <input
              id="antigen"
              type="file"
              accept=".pdb"
              onChange={(e) => handleFileInput(e, 'antigen')}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {!antigenFile ? (
              <div className="flex flex-col items-center justify-center text-center">
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Drop antigen PDB here or click to browse
                </p>
                <p className="text-xs text-gray-500">Supports .pdb files only</p>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">{antigenFile.name}</p>
                    <p className="text-xs text-green-600">
                      {(antigenFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile('antigen')
                  }}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-red-600" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Antigen chain IDs */}
        {antigenFile && (
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">Antigen Chain Configuration</p>
            <div>
              <Label htmlFor="agchains" className="text-sm">Antigen Chain ID(s)</Label>
              <Input
                id="agchains"
                value={antigenChains}
                onChange={(e) => onAntigenChainsChange(e.target.value.toUpperCase())}
                placeholder="A,B,C (comma-separated)"
                className="mt-1 font-mono"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Leave empty for auto-detection. For multiple chains, separate with commas (e.g., A,B,C)
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Progress Summary */}
      {antibodyFile && antigenFile && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-green-800">Files Ready for Upload</h3>
          </div>
          <div className="space-y-2 text-sm text-green-700">
            <p>✓ Antibody: {antibodyFile.name} (Chains: {lightChain}, {heavyChain})</p>
            <p>✓ Antigen: {antigenFile.name} {antigenChains && `(Chains: ${antigenChains})`}</p>
          </div>
        </div>
      )}
    </div>
  )
}
