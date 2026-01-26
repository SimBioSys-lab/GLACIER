"use client"

import React, { useState } from "react"
import { Copy, Download, Check, BookOpen, FileText, GraduationCap, Sparkles } from "lucide-react"

type CitationFormat = "bibtex" | "endnote" | "apa" | "mla"

interface CitationData {
  bibtex: string
  endnote: string
  apa: string
  mla: string
}

export default function CitationSection() {
  const [selectedFormat, setSelectedFormat] = useState<CitationFormat>("bibtex")
  const [copiedFormat, setCopiedFormat] = useState<CitationFormat | null>(null)
  const [downloadedFormat, setDownloadedFormat] = useState<CitationFormat | null>(null)

  // Citation data for different formats
  const citations: CitationData = {
    bibtex: `@software{glacier2025,
  title = {{GLACIER: A comprehensive platform for ensemble-based geometric exposure analysis of glycosylated proteins}},
  author = {{SimBioSys Lab}},
  organization = {Northeastern University},
  year = {2025},
  url = {https://glacier-simbiosys.com},
  note = {Version 1.0}
}`,
    endnote: `%0 Computer Program
%T GLACIER: A comprehensive platform for ensemble-based geometric exposure analysis of glycosylated proteins
%A SimBioSys Lab
%I Northeastern University
%D 2025
%U https://glacier-simbiosys.com
%Z Version 1.0`,
    apa: `SimBioSys Lab. (2025). GLACIER: A comprehensive platform for ensemble-based geometric exposure analysis of glycosylated proteins (Version 1.0) [Computer software]. Northeastern University. https://glacier-simbiosys.com`,
    mla: `SimBioSys Lab. "GLACIER: A comprehensive platform for ensemble-based geometric exposure analysis of glycosylated proteins." Version 1.0, Northeastern University, 2025, glacier-simbiosys.com.`
  }

  const formatLabels = {
    bibtex: { label: "BibTeX", icon: FileText },
    endnote: { label: "EndNote", icon: BookOpen },
    apa: { label: "APA", icon: GraduationCap },
    mla: { label: "MLA", icon: GraduationCap }
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
    a.download = `glacier_citation.${format === 'bibtex' ? 'bib' : format === 'endnote' ? 'enw' : 'txt'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setDownloadedFormat(format)
    setTimeout(() => setDownloadedFormat(null), 2000)
  }

  return (
    <section className="relative bg-gradient-to-b from-white via-[#F5F4F9] to-[#E8E3F0] py-24" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-[#8B7DFF]" />
              <span 
                className="text-sm font-semibold text-[#8B7DFF] uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
              >
                Citation
              </span>
              <Sparkles className="w-5 h-5 text-[#8B7DFF]" />
            </div>
            
            <h2 
              className="text-3xl md:text-4xl font-light text-[#1A1A1A] mb-6"
              style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
            >
              Cite GLACIER
            </h2>
            
            <p className="text-lg text-[#1A1A1A]/70 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
              If you use GLACIER in your research, please cite our work to help others discover and build upon this platform.
            </p>
          </div>

          {/* Format Selector - Simplified */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-2 rounded-xl bg-white/60 backdrop-blur-sm border border-[#1A1A1A]/10 shadow-sm">
              <div className="flex gap-1 items-center">
                {(Object.keys(citations) as CitationFormat[]).map((format) => {
                  const Icon = formatLabels[format].icon
                  return (
                    <button
                      key={format}
                      onClick={() => setSelectedFormat(format)}
                      className={`
                        px-4 py-3 rounded-lg font-semibold text-sm transition-colors duration-150
                        flex items-center gap-2
                        ${selectedFormat === format 
                          ? 'bg-[#8B7DFF] text-white shadow-md' 
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

          {/* Citation Display - Simplified */}
          <div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#1A1A1A]/10 shadow-lg p-8 md:p-10">
              {/* Citation Text */}
              <div className="bg-white/60 rounded-lg p-8 mb-6 overflow-x-auto border border-[#1A1A1A]/5">
                <pre className="whitespace-pre-wrap text-[#1A1A1A]/90 font-mono text-sm" style={{ lineHeight: '1.8' }}>
                  {citations[selectedFormat]}
                </pre>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => handleCopy(selectedFormat)}
                  className="
                    bg-white hover:bg-[#8B7DFF] text-[#1A1A1A] hover:text-white
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
                    bg-[#8B7DFF] hover:bg-[#7B6DFF] text-white
                    px-6 py-3 rounded-lg font-semibold transition-colors duration-150
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
                        Download .{selectedFormat === 'bibtex' ? 'bib' : selectedFormat === 'endnote' ? 'enw' : 'txt'}
                      </span>
                    </div>
                  )}
                </button>
              </div>

              {/* Additional Information */}
              <div className="mt-8 pt-6 border-t border-[#1A1A1A]/10">
                <p className="text-center text-sm text-[#1A1A1A]/60" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                  For questions about citations or to report issues, please contact{' '}
                  <a href="mailto:simbiosyslab.neu@gmail.com" className="text-[#8B7DFF] hover:underline font-semibold">
                    simbiosyslab.neu@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Related Publications */}
          <div className="mt-12 text-center">
            <p className="text-sm text-[#1A1A1A]/60 mb-3" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
              See also our related publications:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/33319171/"
                target="_blank"
                className="text-sm text-[#8B7DFF] hover:text-[#7B6DFF] hover:underline underline-offset-4 transition-colors font-medium"
                style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
              >
                Quantification of the Resilience and Vulnerability of HIV-1 Native Glycan Shield at Atomistic Detail
              </a>
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/33093196/"
                target="_blank"
                className="text-sm text-[#8B7DFF] hover:text-[#7B6DFF] hover:underline underline-offset-4 transition-colors font-medium"
                style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
              >
                Visualization of the HIV-1 Env glycan shield across scales
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
