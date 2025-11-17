"use client"

import React, { useState } from "react"
import { Copy, Download, Check, BookOpen, FileText, GraduationCap, Sparkles } from "lucide-react"
import GlassSurface from '../GlassSurface'

type CitationFormat = "bibtex" | "endnote" | "apa" | "mla"

interface CitationData {
  bibtex: string
  endnote: string
  apa: string
  mla: string
}

export default function CitationSection() {
  // Explicitly avoid using pixelated fonts for better readability
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
  url = {https://glacier.simbiosys.org},
  note = {Version 1.0}
}`,
    endnote: `%0 Computer Program
%T GLACIER: A comprehensive platform for ensemble-based geometric exposure analysis of glycosylated proteins
%A SimBioSys Lab
%I Northeastern University
%D 2025
%U https://glacier.simbiosys.org
%Z Version 1.0`,
    apa: `SimBioSys Lab. (2025). GLACIER: A comprehensive platform for ensemble-based geometric exposure analysis of glycosylated proteins (Version 1.0) [Computer software]. Northeastern University. https://glacier.simbiosys.org`,
    mla: `SimBioSys Lab. "GLACIER: A comprehensive platform for ensemble-based geometric exposure analysis of glycosylated proteins." Version 1.0, Northeastern University, 2025, glacier.simbiosys.org.`
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
    <section className="relative bg-gradient-to-b from-white via-[#F5F4F9] to-[#E8E3F0] py-32 overflow-visible" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
      {/* Decorative background elements - static, no animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#8B7DFF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#A594FF]/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header - removed animations */}
          <div className="text-center mb-12" style={{ minHeight: '200px', padding: '2rem 0' }}>
            <div className="inline-flex items-center gap-2 mb-6 py-2">
              <Sparkles className="w-5 h-5 text-[#8B7DFF]" />
              <span 
                className="text-sm font-semibold text-[#8B7DFF] uppercase tracking-widest block"
                style={{ 
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  display: 'inline-block',
                  padding: '0.25rem 0',
                  lineHeight: '1.5'
                }}
              >
                Citation
              </span>
              <Sparkles className="w-5 h-5 text-[#8B7DFF]" />
            </div>
            
            <h2 
              className="text-3xl md:text-4xl font-light text-[#1A1A1A] mb-6 block"
              style={{ 
                fontFamily: 'var(--font-geist-sans), sans-serif',
                lineHeight: '1.5',
                minHeight: '50px',
                display: 'block',
                overflow: 'visible',
                padding: '0.5rem 0'
              }}
            >
              Cite GLACIER
            </h2>
            
            <p className="text-lg text-[#1A1A1A]/70 max-w-2xl mx-auto leading-relaxed py-2" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
              If you use GLACIER in your research, please cite our work to help others discover and build upon this platform.
            </p>
          </div>

          {/* Format Selector */}
          <div className="flex justify-center mb-8 py-4">
            <GlassSurface
              displace={0.3}
              distortionScale={-100}
              brightness={95}
              opacity={0.9}
              backgroundOpacity={0.05}
              blur={8}
              borderRadius={12}
              className="inline-flex p-2"
              style={{ minHeight: '60px', minWidth: 'fit-content' }}
            >
              <div className="flex gap-1 items-center">
                {(Object.keys(citations) as CitationFormat[]).map((format) => {
                  const Icon = formatLabels[format].icon
                  return (
                    <button
                      key={format}
                      onClick={() => setSelectedFormat(format)}
                      className={`
                        px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200
                        flex items-center gap-2 min-h-[44px]
                        ${selectedFormat === format 
                          ? 'bg-[#8B7DFF] text-white shadow-lg' 
                          : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-white/50'
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
            </GlassSurface>
          </div>

          {/* Citation Display - removed animation */}
          <div>
            <GlassSurface
              displace={0.5}
              distortionScale={-150}
              redOffset={0}
              greenOffset={10}
              blueOffset={20}
              brightness={98}
              opacity={0.95}
              backgroundOpacity={0.02}
              saturation={1.1}
              blur={10}
              borderRadius={16}
              borderWidth={0.05}
              className="w-full"
              style={{ minHeight:'500px', minWidth:'fit-content' }}
            >
              <div className="p-8 md:p-10" style={{ minHeight: '400px' }}>
                {/* Citation Text */}
                <div className="bg-white/40 backdrop-blur-sm rounded-lg p-8 mb-6 overflow-x-auto border border-[#1A1A1A]/10" style={{ minHeight: '200px' }}>
                  <pre className="whitespace-pre-wrap text-[#1A1A1A]/90 font-mono text-sm" style={{ lineHeight: '1.8' }}>
                    {citations[selectedFormat]}
                  </pre>
                </div>

                {/* Action Buttons - simplified animations */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={() => handleCopy(selectedFormat)}
                    className="
                      bg-white hover:bg-[#8B7DFF] text-[#1A1A1A] hover:text-white
                      px-6 py-3 rounded-lg font-semibold transition-colors duration-200
                      shadow-sm hover:shadow-lg border border-[#1A1A1A]/10
                      flex items-center gap-2 group
                      hover:scale-[1.02] active:scale-[0.98]
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
                      px-6 py-3 rounded-lg font-semibold transition-colors duration-200
                      shadow-lg hover:shadow-xl
                      flex items-center gap-2
                      hover:scale-[1.02] active:scale-[0.98]
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
            </GlassSurface>
          </div>

          {/* Related Publications */}
          <div className="mt-12 text-center">
            <p className="text-sm text-[#1A1A1A]/60 mb-3" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
              See also our related publications:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="#"
                className="text-sm text-[#8B7DFF] hover:text-[#7B6DFF] hover:underline underline-offset-4 transition-colors font-medium"
                style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
              >
                Ensemble-based protein analysis (2024)
              </a>
              <span className="text-[#1A1A1A]/30">•</span>
              <a
                href="#"
                className="text-sm text-[#8B7DFF] hover:text-[#7B6DFF] hover:underline underline-offset-4 transition-colors font-medium"
                style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
              >
                GEF methodology paper (2024)
              </a>
              <span className="text-[#1A1A1A]/30">•</span>
              <a
                href="#"
                className="text-sm text-[#8B7DFF] hover:text-[#7B6DFF] hover:underline underline-offset-4 transition-colors font-medium"
                style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
              >
                Glycan shield dynamics (2023)
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}