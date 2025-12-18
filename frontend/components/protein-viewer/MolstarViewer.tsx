'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'

interface MolstarViewerProps {
  pdbData?: string
  pdbUrl?: string
  width?: string | number
  height?: string | number
  backgroundColor?: string
  showControls?: boolean
  autoRotate?: boolean
  initialStyle?: 'cartoon' | 'ball-and-stick' | 'spacefill' | 'surface'
}

const MolstarViewer: React.FC<MolstarViewerProps> = ({
  pdbData,
  pdbUrl,
  width = '100%',
  height = '400px',
  backgroundColor = '#1a1a1a',
  showControls = false,
  autoRotate = false,
  initialStyle = 'cartoon'
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<any>(null)
  const viewerIdRef = useRef<string>(`molstar-${Math.random().toString(36).substr(2, 9)}`)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scriptsReady, setScriptsReady] = useState(false)
  const [proteinInfo, setProteinInfo] = useState<{
    title: string
    atomCount: number
    residueCount: number
  } | null>(null)

  const extractProteinInfo = useCallback((pdbContent: string) => {
    const lines = pdbContent.split('\n')
    let atomCount = 0
    const residues = new Set<string>()
    let title = 'Protein Structure'

    for (const line of lines) {
      if (line.startsWith('TITLE')) {
        title = line.substring(10).trim() || title
      } else if (line.startsWith('ATOM') || line.startsWith('HETATM')) {
        atomCount++
        const chainId = line.substring(21, 22).trim()
        const resSeq = line.substring(22, 26).trim()
        residues.add(`${chainId}_${resSeq}`)
      }
    }

    return { title, atomCount, residueCount: residues.size }
  }, [])

  // Load scripts from unpkg CDN
  useEffect(() => {
    if ((window as any).molstar?.Viewer) {
      setScriptsReady(true)
      return
    }

    // Load CSS
    if (!document.querySelector('link[href*="molstar.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/molstar/build/viewer/molstar.css'
      document.head.appendChild(link)
    }

    // Check for existing script
    const existingScript = document.querySelector('script[src*="molstar.js"]')
    if (existingScript) {
      const checkInterval = setInterval(() => {
        if ((window as any).molstar?.Viewer) {
          clearInterval(checkInterval)
          setScriptsReady(true)
        }
      }, 100)
      setTimeout(() => clearInterval(checkInterval), 15000)
      return
    }

    // Load JS
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/molstar/build/viewer/molstar.js'
    script.async = true
    
    script.onload = () => {
      const checkInterval = setInterval(() => {
        if ((window as any).molstar?.Viewer) {
          clearInterval(checkInterval)
          setScriptsReady(true)
        }
      }, 100)
      setTimeout(() => {
        clearInterval(checkInterval)
        if (!(window as any).molstar?.Viewer) {
          setError('Molstar failed to initialize')
          setIsLoading(false)
        }
      }, 10000)
    }
    
    script.onerror = () => {
      setError('Failed to load Molstar library')
      setIsLoading(false)
    }
    
    document.head.appendChild(script)
  }, [])

  // Initialize viewer when scripts are ready
  useEffect(() => {
    if (!scriptsReady || !containerRef.current) return
    if (!pdbData && !pdbUrl) return
    if (viewerRef.current) return

    const initViewer = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const molstar = (window as any).molstar
        if (!molstar?.Viewer) {
          throw new Error('Molstar not available')
        }

        if (pdbData) {
          const info = extractProteinInfo(pdbData)
          setProteinInfo(info)
        }

        // Create viewer using the element ID (as per official docs)
        const viewer = await molstar.Viewer.create(viewerIdRef.current, {
          layoutIsExpanded: false,
          layoutShowControls: false,
          layoutShowRemoteState: false,
          layoutShowSequence: false,
          layoutShowLog: false,
          layoutShowLeftPanel: false,
          viewportShowExpand: false,
          viewportShowSelectionMode: false,
          viewportShowAnimation: false,
        })

        viewerRef.current = viewer

        // Set background color
        const bgHex = backgroundColor.replace('#', '')
        const r = parseInt(bgHex.substring(0, 2), 16) / 255
        const g = parseInt(bgHex.substring(2, 4), 16) / 255
        const b = parseInt(bgHex.substring(4, 6), 16) / 255
        
        viewer.plugin?.canvas3d?.setProps({
          renderer: { backgroundColor: { r, g, b } }
        })

        // Load structure
        if (pdbData) {
          await viewer.loadStructureFromData(pdbData, 'pdb')
        } else if (pdbUrl) {
          await viewer.loadStructureFromUrl(pdbUrl, 'pdb')
        }

        // Enable auto-rotate
        if (autoRotate) {
          viewer.plugin?.canvas3d?.setProps({
            trackball: { animate: { name: 'spin', params: { speed: 1 } } }
          })
        }

        setIsLoading(false)
      } catch (err: any) {
        console.error('Molstar error:', err)
        setError(err.message || 'Failed to initialize viewer')
        setIsLoading(false)
      }
    }

    setTimeout(initViewer, 200)
  }, [scriptsReady, pdbData, pdbUrl, backgroundColor, autoRotate, extractProteinInfo])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (viewerRef.current) {
        try { viewerRef.current.dispose() } catch (e) {}
        viewerRef.current = null
      }
    }
  }, [])

  return (
    <div style={{ width, height, position: 'relative', backgroundColor, borderRadius: '0.5rem', overflow: 'hidden' }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="text-center text-white">
            <div className="relative w-12 h-12 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full" style={{ border: '3px solid rgba(255,255,255,0.1)' }} />
              <div className="absolute inset-0 rounded-full" style={{ border: '3px solid transparent', borderTopColor: '#8B7DFF', animation: 'molstar-spin 1s linear infinite' }} />
            </div>
            <p className="text-sm opacity-80">Loading Mol* viewer...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-20" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
          <div className="text-center text-white p-6">
            <p className="text-red-400 font-medium mb-2">Error loading viewer</p>
            <p className="text-sm text-white/60">{error}</p>
          </div>
        </div>
      )}

      <div ref={containerRef} id={viewerIdRef.current} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />

      {proteinInfo && !isLoading && !error && (
        <div className="absolute bottom-3 left-3 z-30 pointer-events-none" style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', borderRadius: '12px', fontSize: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="font-semibold mb-1 text-[#8B7DFF] text-sm">{proteinInfo.title}</div>
          <div className="text-white/70 space-y-0.5">
            <div>Atoms: <span className="text-white/90">{proteinInfo.atomCount.toLocaleString()}</span></div>
            <div>Residues: <span className="text-white/90">{proteinInfo.residueCount.toLocaleString()}</span></div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes molstar-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .msp-plugin .msp-layout-standard-outside, .msp-plugin .msp-layout-region-top, .msp-plugin .msp-layout-region-left, .msp-plugin .msp-layout-region-right, .msp-plugin .msp-layout-region-bottom, .msp-plugin .msp-viewport-controls, .msp-plugin .msp-highlight-info { display: none !important; }
        .msp-plugin { background: transparent !important; }
      `}</style>
    </div>
  )
}

export default MolstarViewer
