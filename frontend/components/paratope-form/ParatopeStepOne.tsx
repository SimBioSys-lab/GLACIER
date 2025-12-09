"use client"

import React, { useState } from "react"
import { Upload, FileText, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

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
