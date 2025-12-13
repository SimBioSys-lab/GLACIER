"use client"

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SimplifiedGlassSurface from '../SimplifiedGlassSurface'

interface DocumentationModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'glycoshield' | 'vasco'
}

interface Subsection {
  subheading: string
  content: string
  list?: string[]
  note?: string
  isWarning?: boolean
  codeBlock?: string[]
}

interface Section {
  heading: string
  content: string
  list?: string[]
  note?: string
  highlight?: boolean
  subsections?: Subsection[]
}

export default function DocumentationModal({ isOpen, onClose, type }: DocumentationModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const content = type === 'glycoshield' ? {
    title: 'Understanding GLYCOSHIELD',
    color: '#8B7DFF',
    sections: [
      {
        heading: 'The Glycan Shield Challenge',
        content: 'Many clinically important enveloped viruses mask their surface proteins with a dense layer of host-derived sugars, known as the glycan shield. This sugar coating acts as a powerful immune evasion mechanism by sterically blocking antibody access to the underlying protein surface and, in some cases, directly participating in antibody recognition. Because these surface glycoproteins are the primary targets of neutralizing antibodies and vaccines, understanding how glycan shielding operates is central to rational immunogen design.'
      },
      {
        heading: 'Why Computational Modeling?',
        content: 'Glycans, however, are notoriously difficult to characterize experimentally. Their intrinsic flexibility, chemical heterogeneity, and rapid motion mean that most structural methods resolve only a small fraction of the glycan mass. What ultimately governs immune accessibility is not a single glycan conformation, but the cumulative, time-averaged effect of many dynamically fluctuating configurations. Computational modeling is therefore essential to bridge this gap.'
      },
      {
        heading: 'Ensemble-Based Atomistic Modeling',
        content: 'This platform employs an ensemble-based atomistic modeling approach (building on ALLOSMOD from Sali lab) to capture glycan behavior realistically. Starting from an experimentally determined protein scaffold, individual glycans are modeled at their glycosylation sites and extensively sampled using energy minimization and simulated annealing. Thousands of distinct conformations are generated to form an ensemble that represents the accessible conformational space of the fully glycosylated protein, capturing effects of flexibility, crowding, and protein context.',
        highlight: true
      },
      {
        heading: 'Glycan Encounter Factor (GEF)',
        content: 'Shielding is quantified using the Glycan Encounter Factor (GEF), which measures the probability that an approaching probe—representing the first line of antibody contact—encounters glycan atoms before reaching the protein surface. GEF produces spatial maps that distinguish persistently shielded regions from potential sites of vulnerability.',
        highlight: true
      },
      {
        heading: 'Glycan–Glycan Network Analysis',
        content: 'Finally, the glycan shield is analyzed as a network, where glycans are nodes connected by ensemble-averaged volume overlap. Network analysis reveals highly connected glycan clusters, sparsely protected regions, and collective behaviors that shape global immune accessibility.'
      },
      {
        heading: 'Required Input: align.ali',
        content: 'GlycoShield uses a MODELLER-style alignment file, named align.ali, to define the relationship between template structures and the target protein. This alignment generates structural restraints during model construction and ensemble generation.',
        highlight: true,
        subsections: [
          {
            subheading: 'File Format',
            content: 'The align.ali file must follow Sali Lab MODELLER alignment syntax and contain one entry for each template PDB file plus one target sequence entry named pm.pdb. Each entry begins with a >P1; header, and the alignment code must exactly match the corresponding PDB filename.',
            list: [
              'Multiple chains: Specify by separating chains with / following MODELLER conventions',
              'Chain order and residue numbering must be consistent between alignment and PDB structures',
              'Each sequence must end with a terminating *'
            ]
          },
          {
            subheading: 'How to Generate',
            content: 'Generate the alignment file after proper sequence or structure-based alignment using:',
            list: [
              "MODELLER's built-in alignment utilities",
              'ClustalW or similar alignment programs',
              'Structure-based alignment workflows (recommended when possible)'
            ]
          },
          {
            subheading: '⚠️ Critical: Alignment Quality',
            content: 'Small alignment errors can lead to large structural artifacts during simulation. Avoid misalignments where adjacent residues are aligned far apart, pay attention to chain termini where errors often occur, and ensure gaps and insertions are biologically reasonable. Poor alignments can cause severe energy conservation problems during modeling.',
            isWarning: true
          },
          {
            subheading: 'Usage Scenarios',
            content: '',
            list: [
              'Homology modeling: Template entry corresponds to homologous structure PDB, target entry (pm.pdb) contains desired target sequence',
              'Known structures: Provide same PDB file as both template and target, use same sequence for both entries'
            ]
          }
        ]
      },
      {
        heading: 'Required Input: glyc.dat',
        content: 'The glycosylation input file must be named glyc.dat. This file defines the explicit chemical structure of each glycan to be attached to the protein, specifying glycans at the monomer-by-monomer level following Sali Lab/MODELLER glycosylation format.',
        highlight: true,
        subsections: [
          {
            subheading: 'File Structure',
            content: 'The file contains one line per sugar monomer. Monomers belonging to the same glycan are listed consecutively, forming a chain. The first line of each glycan chain corresponds to the protein-bonded sugar.',
            note: 'Each line contains three columns: <monomer_name> <bond_type> <attachment_residue_index>'
          },
          {
            subheading: 'Column 1: Monomer Name',
            content: 'Specifies the chemical identity of the sugar monomer. Supported monomers include:',
            list: [
              'NAG – β-N-Acetyl-D-Glucosamine',
              'NGA – β-N-Acetyl-D-Galactosamine',
              'GLB – β-Galactose',
              'FUC – α-Fucose',
              'MAN – α-Mannose',
              'BMA – β-Mannose',
              'NAN – α-Neuraminic acid'
            ]
          },
          {
            subheading: 'Column 2: Bond Type',
            content: 'Defines the glycosidic linkage type, including stereochemistry and attachment position.',
            list: [
              'Protein–glycan bonds: NGLA/NGLB (to ASN), SGPA/SGPB (to SER), TGPA/TGPB (to THR)',
              'Glycan–glycan bonds: 16ab, 16fu, 14bb, 13ab, 13bb, 12aa, 12ba',
              'Sialic acid bonds: sa23 (α 2→3), sa26 (α 2→6)'
            ]
          },
          {
            subheading: 'Column 3: Attachment Residue',
            content: 'Specifies which residue the monomer attaches to:',
            list: [
              'First monomer: protein residue number (e.g., ASN, SER, or THR index)',
              'Subsequent monomers: index of the previous sugar residue in the same glycan chain',
              'For multiple chains: renumber glycan positions to be continuously increasing from the end of the previous chain'
            ],
            note: 'This numbering defines the connectivity and branching structure of the glycan. Branching is handled by specifying multiple monomers that attach to the same sugar residue index.'
          },
          {
            subheading: 'Example: Mannose-9 at residue 58',
            content: '',
            codeBlock: [
              'NAG NGLB 58',
              'NAG 14bb 1',
              'BMA 14bb 2',
              'MAN 13ab 3',
              'MAN 16ab 3',
              'MAN 13ab 5',
              'MAN 16ab 5',
              'MAN 12aa 7',
              'MAN 12aa 6',
              'MAN 12aa 4',
              'MAN 12aa 10'
            ]
          },
          {
            subheading: 'Example: Fucosylated two-antennae at residue 608',
            content: '',
            codeBlock: [
              'NAG NGLB 608',
              'NAG 14bb 1',
              'BMA 14bb 2',
              'MAN 13ab 3',
              'MAN 16ab 3',
              'NAG 12ba 4',
              'NAG 12ba 5',
              'GLB 14bb 6',
              'GLB 14bb 7',
              'NAN sa23 8',
              'NAN sa23 9',
              'FUC 16fu 1'
            ]
          }
        ]
      }
    ] as Section[]
  } : {
    title: 'VASCO: Viral Antibody Structural Complex Analysis',
    subtitle: 'Structure-Based Interface Prediction',
    color: '#FF6B9D',
    sections: [
      {
        heading: 'What is VASCO?',
        content: 'VASCO is a structure-based computational platform for predicting antibody–antigen binding interfaces, designed to identify both paratope residues on antibodies and epitope residues on antigens. The goal of VASCO is to provide rapid, interpretable insights into molecular recognition that can guide experimental design, antibody engineering, and vaccine development.'
      },
      {
        heading: 'Input Requirements',
        content: 'VASCO takes as input two three-dimensional PDB structures:',
        list: [
          'Antibody Fab structure, containing one heavy chain (chain H) and one light chain (chain L)',
          'Antigen structure, corresponding to the viral protein of interest'
        ],
        note: 'The input structures may be experimentally determined (e.g., X-ray, cryo-EM, NMR) or computationally predicted (e.g., homology modeling, AlphaFold, or related methods). This flexibility allows VASCO to be used even when experimental complexes are unavailable.'
      },
      {
        heading: 'What You Get',
        content: 'VASCO produces residue-level predictions that include:',
        list: [
          'Binding probability scores for each residue on the antibody and antigen',
          'Identification of likely paratope and epitope residues',
          'Relative importance of residues, derived from learned masking mechanisms that highlight positions most influential for binding'
        ],
        note: 'All outputs are designed to be directly visualized on protein structures and interpreted at the residue level.',
        highlight: true
      },
      {
        heading: 'Use Cases',
        content: 'VASCO is intentionally designed to support multiple modes of use:',
        list: [
          'Prediction: Identify likely binding interfaces for new antibody–antigen pairs',
          'Screening: Compare multiple antibodies or antigen variants to prioritize candidates',
          'Hypothesis generation: Suggest mutations, validate experimental observations, or explore alternative binding modes'
        ],
        highlight: true
      },
      {
        heading: 'Why VASCO Works',
        content: 'Because the model integrates sequence-derived features, structural context, and learned attention and masking, its predictions are not only accurate but also biophysically interpretable. VASCO complements physics-based modeling and experimental approaches by enabling fast, scalable, and hypothesis-driven exploration of antibody–antigen interactions across diverse viral systems.'
      }
    ] as Section[]
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="min-h-screen px-4 py-8 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
              >
                <SimplifiedGlassSurface
                  borderRadius={24}
                  blur={30}
                  opacity={0.95}
                  className="w-full"
                >
                  <div className="relative max-h-[85vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-white/40 backdrop-blur-md border-b border-black/5">
                      <div className="p-6 md:p-8">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {/* Icon */}
                              <div 
                                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                                style={{ 
                                  backgroundColor: content.color,
                                }}
                              >
                                {type === 'glycoshield' ? (
                                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                )}
                              </div>
                              
                              <div>
                                <h2 
                                  className="text-2xl md:text-3xl font-semibold text-black/80"
                                  style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                                >
                                  {content.title}
                                </h2>
                                {content.subtitle && (
                                  <p 
                                    className="text-sm text-black/60 mt-1"
                                    style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                                  >
                                    {content.subtitle}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Close Button */}
                          <button
                            onClick={onClose}
                            className="ml-4 p-2 rounded-full hover:bg-black/5 transition-colors duration-150 group"
                            aria-label="Close modal"
                          >
                            <svg 
                              className="w-6 h-6 text-black/40 group-hover:text-black/60 transition-colors" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 space-y-8">
                      {content.sections.map((section, index) => (
                        <div 
                          key={index}
                          className={`${
                            section.highlight 
                              ? 'bg-gradient-to-br from-white/60 to-white/40 border border-black/5 rounded-2xl p-6' 
                              : ''
                          }`}
                        >
                          {/* Section Heading */}
                          <h3 
                            className="text-lg md:text-xl font-semibold mb-3"
                            style={{ 
                              fontFamily: 'var(--font-geist-sans), sans-serif',
                              color: section.highlight ? content.color : 'rgba(0,0,0,0.8)'
                            }}
                          >
                            {section.heading}
                          </h3>

                          {/* Section Content */}
                          {section.content && (
                            <p 
                              className="text-base text-black/70 leading-relaxed mb-4"
                              style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                            >
                              {section.content}
                            </p>
                          )}

                          {/* List Items */}
                          {section.list && (
                            <ul className="space-y-3 mb-4">
                              {section.list.map((item, i) => (
                                <li 
                                  key={i}
                                  className="flex items-start gap-3 text-black/70"
                                  style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                                >
                                  <div 
                                    className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                                    style={{ backgroundColor: content.color }}
                                  />
                                  <span className="text-sm leading-relaxed">{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Note */}
                          {section.note && (
                            <div className="mt-4 p-4 bg-black/5 rounded-xl">
                              <p 
                                className="text-sm text-black/60 leading-relaxed italic"
                                style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                              >
                                {section.note}
                              </p>
                            </div>
                          )}

                          {/* Subsections */}
                          {section.subsections && (
                            <div className="mt-6 space-y-6">
                              {section.subsections.map((subsection, subIndex) => (
                                <div 
                                  key={subIndex}
                                  className={`pl-4 border-l-2 ${
                                    subsection.isWarning 
                                      ? 'border-orange-400 bg-orange-50/50' 
                                      : 'border-black/10'
                                  } ${subsection.isWarning ? 'p-4 rounded-lg' : ''}`}
                                >
                                  <h4 
                                    className={`text-base font-semibold mb-2 ${
                                      subsection.isWarning ? 'text-orange-700' : 'text-black/70'
                                    }`}
                                    style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                                  >
                                    {subsection.subheading}
                                  </h4>
                                  
                                  {subsection.content && (
                                    <p 
                                      className={`text-sm leading-relaxed mb-3 ${
                                        subsection.isWarning ? 'text-orange-600/80' : 'text-black/60'
                                      }`}
                                      style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                                    >
                                      {subsection.content}
                                    </p>
                                  )}

                                  {subsection.list && (
                                    <ul className="space-y-2 mb-3">
                                      {subsection.list.map((item, i) => (
                                        <li 
                                          key={i}
                                          className="flex items-start gap-2 text-black/60"
                                          style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                                        >
                                          <div 
                                            className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                                            style={{ backgroundColor: content.color }}
                                          />
                                          <span className="text-xs leading-relaxed">{item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}

                                  {subsection.note && (
                                    <div className="mt-3 p-3 bg-black/5 rounded-lg">
                                      <p 
                                        className="text-xs text-black/60 leading-relaxed font-mono"
                                        style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
                                      >
                                        {subsection.note}
                                      </p>
                                    </div>
                                  )}

                                  {subsection.codeBlock && (
                                    <div className="mt-3 p-4 bg-black/90 rounded-lg overflow-x-auto">
                                      <pre className="text-xs text-green-400 font-mono leading-relaxed">
                                        {subsection.codeBlock.join('\n')}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-white/40 backdrop-blur-md border-t border-black/5 p-6">
                      <div className="flex justify-end">
                        <button
                          onClick={onClose}
                          className="px-6 py-3 rounded-lg font-medium transition-all duration-150 shadow-md hover:shadow-lg"
                          style={{ 
                            fontFamily: 'var(--font-geist-sans), sans-serif',
                            backgroundColor: content.color,
                            color: 'white'
                          }}
                        >
                          Got it
                        </button>
                      </div>
                    </div>
                  </div>
                </SimplifiedGlassSurface>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
