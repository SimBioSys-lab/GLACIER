"use client"

import React, { useState } from "react"
import { Copy, Download, Check, BookOpen, FileText, Sparkles, Zap } from "lucide-react"

type CitationFormat = "bibtex" | "apa"

interface CitationData {
  bibtex: string
  apa: string
}

export default function ParatopeCitation() {
  const [selectedFormat, setSelectedFormat] = useState<CitationFormat>("bibtex")
  const [copiedFormat, setCopiedFormat] = useState<CitationFormat | null>(null)
  const [downloadedFormat, setDownloadedFormat] = useState<CitationFormat | null>(null)

  // Citation data for VASCO
  const citations: CitationData = {
    bibtex: `@software{vasco2025,
  title = {{VASCO: Viral Antibody Structural Complex Analysis via GLACIER Platform}},
  author = {{SimBioSys Lab}},
  organization = {Northeastern University},
  year = {2025},
  url = {https://glacier-simbiosys.com/vasco},
  note = {MSA-powered antibody interface prediction}
}`,
    apa: `SimBioSys Lab. (2025). VASCO: Viral Antibody Structural Complex Analysis via GLACIER Platform [Computer software]. Northeastern University. https://glacier-simbiosys.com/vasco`
  }

  const formatLabels = {
    bibtex: { label: "BibTeX", icon: FileText },
    apa: { label: "APA", icon: BookOpen }
  }

  const handleCopy = async (format: CitationFormat) => {
    try {
      await navigator.clipboard.writeText(citations[format])
      setCopiedFormat(format)
      setTimeout(() => setCopiedFormat(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = (format: CitationFormat) => {
    const content = citations[format]
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `paratope_citation.${format === 'bibtex' ? 'bib' : 'txt'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setDownloadedFormat(format)
    setTimeout(() => setDownloadedFormat(null), 2000)
  }

  return (
    <section className="relative bg-gradient-to-b from-white via-[#FFF0F5] to-[#FFE4E9] py-24" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-[#FF6B9D]" />
              <span 
                className="text-sm font-semibold text-[#FF6B9D] uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
              >
                Citation
              </span>
              <Zap className="w-5 h-5 text-[#FF6B9D]" />
            </div>
            
            <h2 
              className="text-3xl md:text-4xl font-light text-[#1A1A1A] mb-6"
              style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
            >
              Cite VASCO
            </h2>
            
            <p className="text-lg text-[#1A1A1A]/70 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
              If you use VASCO in your research, please cite our work to support continued development.
            </p>
          </div>

          {/* Format Selector */}
          <div className="flex justify-center mb-8">
            <div 
              className="inline-flex p-2 rounded-xl bg-white/60 backdrop-blur-sm border border-[#1A1A1A]/10 shadow-sm"
            >
              <div className="flex gap-1 items-center">
                {(Object.keys(citations) as CitationFormat[]).map((format) => {
                  const Icon = formatLabels[format].icon
                  return (
                    <button
                      key={format}
                      onClick={() => setSelectedFormat(format)}
                      className={`
                        px-6 py-3 rounded-lg font-semibold text-sm transition-colors duration-150
                        flex items-center justify-center gap-2 w-[120px]
                        ${selectedFormat === format 
                          ? 'bg-gradient-to-r from-[#FF6B9D] to-[#C44569] text-white shadow-md' 
                          : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-white/80'
                        }
                      `}
                      style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                    >
                      <Icon className="w-4 h-4" />
                      {formatLabels[format].label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Citation Display */}
          <div>
            <div 
              className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#1A1A1A]/10 shadow-lg p-8 md:p-10"
            >
              {/* Citation Text */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-8 mb-6 overflow-x-auto border border-pink-200">
                <pre className="whitespace-pre-wrap text-[#1A1A1A]/90 font-mono text-sm" style={{ lineHeight: '1.8' }}>
                  {citations[selectedFormat]}
                </pre>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => handleCopy(selectedFormat)}
                  className="
                    bg-white hover:bg-[#FF6B9D] text-[#1A1A1A] hover:text-white
                    px-6 py-3 rounded-lg font-semibold transition-colors duration-150
                    shadow-sm hover:shadow-md border border-[#1A1A1A]/10
                    flex items-center gap-2 group
                  "
                  style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                >
                  {copiedFormat === selectedFormat ? (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600 group-hover:text-white" />
                      <span>Copied!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Copy className="w-4 h-4" />
                      <span>Copy to Clipboard</span>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => handleDownload(selectedFormat)}
                  className="
                    bg-gradient-to-r from-[#FF6B9D] to-[#C44569] hover:from-[#FF5B8D] hover:to-[#B43559] text-white
                    px-6 py-3 rounded-lg font-semibold transition-all duration-150
                    shadow-md hover:shadow-lg
                    flex items-center gap-2
                  "
                  style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                >
                  {downloadedFormat === selectedFormat ? (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Downloaded!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <span>
                        Download .{selectedFormat === 'bibtex' ? 'bib' : 'txt'}
                      </span>
                    </div>
                  )}
                </button>
              </div>

              {/* Additional Information */}
              <div className="mt-8 pt-6 border-t border-[#1A1A1A]/10">
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 border border-pink-200">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FF6B9D]" />
                    About VASCO
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    VASCO (Viral Antibody Structural Complex Analysis) uses state-of-the-art deep learning:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-[#FF6B9D] font-bold">•</span>
                      <span><strong>Multiple Sequence Alignments (MSA)</strong> for evolutionary information via HHblits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FF6B9D] font-bold">•</span>
                      <span><strong>ESM2 protein language model</strong> embeddings for sequence context</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FF6B9D] font-bold">•</span>
                      <span><strong>Graph Neural Networks</strong> for spatial structure representation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FF6B9D] font-bold">•</span>
                      <span><strong>Transformer attention</strong> for sequence-structure integration</span>
                    </li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-4 italic">
                    Processing time: 4-8 hours | GPU-accelerated inference | Per-residue confidence scores
                  </p>
                </div>
                
                <p className="text-center text-sm text-[#1A1A1A]/60 mt-6" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                  For questions about citations or to report issues, please contact{' '}
                  <a href="mailto:simbiosyslab.neu@gmail.com" className="text-[#FF6B9D] hover:text-[#C44569] hover:underline font-semibold">
                    simbiosyslab.neu@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
