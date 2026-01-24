"use client"

import React, { useState, useEffect } from "react"
import { Upload, X, Folder, ChevronDown, ChevronRight, File, AlertCircle, FlaskRound, Download, Settings, BookOpen, FileText, ExternalLink, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FilePreview from "@/components/file-preview"
import { InfoModal, InfoButton } from "@/components/InfoModal"
import { loadExampleFiles, loadExampleFilesByType, getExampleDownloadFiles, isExampleData, EXAMPLE_DATA, EXAMPLE_OPTIONS, ExampleType } from "@/services/exampleDataService"
import { MAX_FILES } from "@/app/config"
import { validateFiles, getFileValidationMessage, isPDBFile } from "@/utils/fileValidation"
import { readAndParseInputDat } from "@/utils/inputDatParser"
import { FolderGroup, FileWithPath, FolderConfig } from "@/types/folderConfig"

interface StepOneProps {
  files: File[]
  folderConfigs: FolderGroup[]
  onFilesChange: (files: File[]) => void
  updateFolderConfig: (folderName: string, updates: Partial<FolderConfig>) => void
  onFormDataChange: (data: any) => void
}

// Helper function to trigger download for a single file
const downloadFile = (url: string, filename: string) => {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// Helper function to download example files by type
const downloadExampleFilesByType = (type: ExampleType) => {
  const files = getExampleDownloadFiles(type)
  files.forEach((file, index) => {
    setTimeout(() => {
      downloadFile(file.url, file.name)
    }, index * 300)
  })
}

// Component for folder configuration panel
const FolderConfigPanel = ({ 
  folder, 
  updateConfig 
}: { 
  folder: FolderGroup
  updateConfig: (updates: Partial<FolderConfig>) => void 
}) => {
  const { config } = folder
  
  // Ensure default values
  const numberOfRuns = config.numberOfRuns || 1
  const gefProbeRadius = config.gefProbeRadius || 3
  const attachGaps = config.attachGaps !== undefined ? config.attachGaps : true
  
  return (
    <div className="p-4 bg-[#F5F4F9]/50 border-t border-[#1A1A1A]/10 space-y-4">
      <h5 className="text-sm font-medium text-[#1A1A1A] flex items-center gap-2">
        <Settings className="w-4 h-4" />
        Folder Configuration
      </h5>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Number of Runs */}
        <div className="space-y-2">
          <Label className="text-xs text-[#1A1A1A]">
            Number of Frames
            {config.loadedFromInputDat?.nruns && (
              <span className="ml-1 text-[#8B7DFF]">(from input.dat)</span>
            )}
          </Label>
          <Input
            type="number"
            min="1"
            max="1000"
            value={numberOfRuns}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1
              updateConfig({ 
                numberOfRuns: Math.max(1, Math.min(1000, value)),
                loadedFromInputDat: {
                  ...config.loadedFromInputDat,
                  nruns: false
                }
              })
            }}
            className="h-8 text-sm bg-white/70 border-[#1A1A1A]/20"
          />
          <p className="text-xs text-amber-600 mt-1">
            💡 At least 100 frames recommended for statistically meaningful GEF results
          </p>
        </div>
        
        {/* GEF Probe Radius */}
        <div className="space-y-2">
          <Label className="text-xs text-[#1A1A1A]">
            GEF Probe Radius (Å)
            {config.loadedFromInputDat?.gefProbeRadius && (
              <span className="ml-1 text-[#8B7DFF]">(from input.dat)</span>
            )}
          </Label>
          <Input
            type="number"
            min="1"
            max="10"
            value={gefProbeRadius}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 3
              updateConfig({ 
                gefProbeRadius: Math.max(1, Math.min(10, value)),
                loadedFromInputDat: {
                  ...config.loadedFromInputDat,
                  gefProbeRadius: false
                }
              })
            }}
            className="h-8 text-sm bg-white/70 border-[#1A1A1A]/20"
          />
        </div>
        
        {/* Attach Gaps */}
        <div className="space-y-2">
          <Label className="text-xs text-[#1A1A1A]">
            Attach Gaps
            {config.loadedFromInputDat?.attachGaps && (
              <span className="ml-1 text-[#8B7DFF]">(from input.dat)</span>
            )}
          </Label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                updateConfig({ 
                  attachGaps: !attachGaps,
                  loadedFromInputDat: {
                    ...config.loadedFromInputDat,
                    attachGaps: false
                  }
                })
              }}
              className={`
                relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ease-in-out
                ${attachGaps ? 'bg-[#8B7DFF]' : 'bg-[#1A1A1A]/20'}
              `}
              aria-pressed={attachGaps}
            >
              <span
                className={`
                  inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out shadow
                  ${attachGaps ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
            <span className={`text-xs font-medium ${attachGaps ? 'text-green-600' : 'text-gray-500'}`}>
              {attachGaps ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-[#1A1A1A]/60 bg-white/50 p-2 rounded">
        NRUNS={numberOfRuns} | GEF_PROBE_RADIUS={gefProbeRadius} | ATTACH_GAPS={attachGaps ? 'True' : 'False'}
      </div>
    </div>
  )
}

export default function StepOne({
  files,
  folderConfigs,
  onFilesChange,
  updateFolderConfig,
  onFormDataChange
}: StepOneProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isLoadingExample, setIsLoadingExample] = useState(false);
  const [isExample, setIsExample] = useState(false);
  const [currentExampleType, setCurrentExampleType] = useState<ExampleType | null>(null);
  const [currentExampleName, setCurrentExampleName] = useState('');
  const [isDownloadingExample, setIsDownloadingExample] = useState(false);
  const [showExampleSelector, setShowExampleSelector] = useState(false);

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
  };

  // Parse input.dat files when folders change
  useEffect(() => {
    folderConfigs.forEach(async (folder) => {
      const inputDatFile = folder.files.find(f => f.name.toLowerCase() === 'input.dat')
      if (inputDatFile && !folder.config.loadedFromInputDat?.nruns && !folder.config.loadedFromInputDat?.attachGaps) {
        try {
          const parsed = await readAndParseInputDat(inputDatFile)
          const updates: Partial<FolderConfig> = {}
          const loadedFlags: any = {}
          
          if (parsed.nruns !== undefined) {
            updates.numberOfRuns = parsed.nruns
            loadedFlags.nruns = true
          }
          
          if (parsed.attachGaps !== undefined) {
            updates.attachGaps = parsed.attachGaps
            loadedFlags.attachGaps = true
          }
          
          if (Object.keys(updates).length > 0) {
            updateFolderConfig(folder.name, {
              ...updates,
              loadedFromInputDat: { ...folder.config.loadedFromInputDat, ...loadedFlags }
            })
          }
        } catch (error) {
          console.error(`Error parsing input.dat for folder ${folder.name}:`, error)
        }
      }
    })
  }, [folderConfigs, updateFolderConfig])

  const handleLoadExample = async (type: ExampleType = 'both') => {
    setIsLoadingExample(true);
    setShowExampleSelector(false);
    try {
      const exampleData = await loadExampleFilesByType(type);
      onFilesChange(exampleData.files);
      onFormDataChange(exampleData.formData);
      setIsExample(true);
      setCurrentExampleType(type);
      setCurrentExampleName(exampleData.exampleName);
      
      // Auto-expand the relevant example folders
      if (type === 'both') {
        setExpandedFolders(new Set(['spikeD', 'bg505']));
      } else if (type === 'spikeD') {
        setExpandedFolders(new Set(['spikeD']));
      } else {
        setExpandedFolders(new Set(['bg505']));
      }
      
      console.log(`Example files loaded successfully: ${type}`);
    } catch (error) {
      console.error('Failed to load example files:', error);
      alert('Failed to load example files. Please try again.');
    } finally {
      setIsLoadingExample(false);
    }
  };

  const handleDownloadExample = () => {
    if (!currentExampleType) return;
    setIsDownloadingExample(true);
    console.log(`Starting download of example files: ${currentExampleType}`);
    downloadExampleFilesByType(currentExampleType);
    setTimeout(() => {
      setIsDownloadingExample(false);
      console.log('Example files download initiated');
    }, 1500);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []) as FileWithPath[]

    // Validate files
    const { validFiles, invalidTypeFiles, oversizedFiles } = validateFiles(selectedFiles)

    // Calculate how many files can be added
    const availableSlots = MAX_FILES - files.length
    const filesToAdd = validFiles.slice(0, availableSlots)
    const exceedsMaxCount = validFiles.length - filesToAdd.length

    // Show validation messages if needed
    const validationMessage = getFileValidationMessage(
      invalidTypeFiles.length,
      oversizedFiles.length,
      exceedsMaxCount
    )

    if (validationMessage) {
      alert(validationMessage)
    }

    // Add the valid files
    if (filesToAdd.length > 0) {
      onFilesChange([...files, ...filesToAdd])
      setIsExample(false);
      
      // Auto-expand newly added folders
      const newFolders = [...new Set(filesToAdd.map((f: FileWithPath) => {
        const path = f.webkitRelativePath || (f as any)._examplePath || '';
        return path ? path.split('/')[0] : 'Uploaded Files';
      }))];
      
      setExpandedFolders(prev => {
        const newSet = new Set(prev);
        newFolders.forEach(folder => newSet.add(folder));
        return newSet;
      });
    }
  }

  const removeFile = (fileToRemove: File) => {
    const updatedFiles = files.filter(f => f !== fileToRemove);
    onFilesChange(updatedFiles);
    if (updatedFiles.length === 0) {
      setIsExample(false);
    }
  }
  
  const removeFolder = (folderName: string) => {
    const filesWithPath = files as FileWithPath[];
    const updatedFiles = filesWithPath.filter(f => {
      const path = f.webkitRelativePath || (f as any)._examplePath || '';
      const folder = path ? path.split('/')[0] : 'Uploaded Files';
      return folder !== folderName;
    });
    onFilesChange(updatedFiles);
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      newSet.delete(folderName);
      return newSet;
    });
    if (updatedFiles.length === 0) {
      setIsExample(false);
    }
  };
  
  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderName)) {
        newSet.delete(folderName);
      } else {
        newSet.add(folderName);
      }
      return newSet;
    });
  };

  // Filter PDB files for preview
  const pdbFiles = files.filter(f => isPDBFile(f.name))
  const pdbCount = pdbFiles.length;
  
  // Check if all folders are complete
  const allComplete = folderConfigs.every(f => f.status.isComplete);
  const incompleteFolders = folderConfigs.filter(f => !f.status.isComplete);

  // Get missing requirements for a folder
  const getMissingRequirements = (folder: FolderGroup) => {
    const missing: string[] = [];
    if (!folder.status.hasPDB) missing.push('PDB file');
    if (!folder.status.hasALI) missing.push('ALI file');
    if (!folder.status.hasGlycDat) missing.push('glyc.dat');
    if (!folder.status.hasInputDat) missing.push('input.dat');
    return missing;
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h2 className="text-3xl md:text-4xl font-light text-[#1A1A1A]">
            Upload Files & Configure
          </h2>
          <InfoButton onClick={() => setShowInfoModal(true)} />
        </div>

      {/* Example Data Banner */}
      {isExample && (
        <div className="bg-gradient-to-r from-[#8B7DFF]/10 to-blue-500/10 border border-[#8B7DFF]/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <FlaskRound className="w-5 h-5 text-[#8B7DFF]" />
            <div className="flex-1 text-left">
              <h4 className="text-sm font-medium text-[#1A1A1A]">
                Viewing Example Data: {currentExampleName}
              </h4>
              <p className="text-xs text-[#1A1A1A]/70 mt-1">
                {currentExampleType === 'spikeD' && EXAMPLE_OPTIONS.spikeD.description}
                {currentExampleType === 'bg505' && EXAMPLE_OPTIONS.bg505.description}
                {currentExampleType === 'both' && 'Two example analyses: SARS-CoV-2 spike protein and HIV BG505 envelope protein glycosylation'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleDownloadExample}
                  disabled={isDownloadingExample}
                  className="bg-[#8B7DFF] hover:bg-[#8B7DFF]/90 text-white text-xs"
                >
                  {isDownloadingExample ? (
                    <span className="flex items-center gap-1">
                      <span className="animate-spin">⏳</span>
                      Downloading...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      Download Example Files
                    </span>
                  )}
                </Button>
                <p className="text-xs text-[#1A1A1A]/60">
                  {currentExampleType === 'both' ? 'Download all 8 example files (2 folders)' : 'Download 4 example files (1 folder)'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onFilesChange([]);
                setIsExample(false);
                setCurrentExampleType(null);
                setCurrentExampleName('');
              }}
              className="text-xs text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
            >
              Clear Example
            </Button>
          </div>
        </div>
      )}
        <p className="text-[#1A1A1A]/70">
          Upload your research files and configure analysis parameters
        </p>
        <p className="text-sm text-[#1A1A1A]/50 mt-2">
          Each folder must contain: At least one .pdb file, at least one .ali file, glyc.dat, and input.dat
        </p>
        <p className="text-sm text-[#8B7DFF] font-medium mt-1">
          ⚡ Each folder can have its own configuration (NRUNS, GEF Probe Radius, Attach Gaps)
        </p>
      </div>

      {/* Processing Time Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-2">Processing Time & Pipeline Stages</p>
            <p className="mb-3">The complete GlycoShield analysis involves multiple computational stages. <span className="font-semibold">Times shown are for generating an ensemble of ~1000 frames:</span></p>
            <div className="bg-amber-100/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center">1</span>
                <span><strong>AllosMod Ensemble Generation</strong> — 2-8 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center">2</span>
                <span><strong>PDB Processing & Alignment</strong> — 1-2 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center">3</span>
                <span><strong>GEF Surface Analysis</strong> — 30-45 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center">4</span>
                <span><strong>Results Upload & Finalization</strong></span>
              </div>
            </div>
            <div className="mt-3 p-3 bg-green-100/70 border border-green-300/50 rounded-lg">
              <p className="text-green-800 text-xs">
                <span className="font-semibold">⚡ For comparison:</span> Typical time to generate equivalent ensembles using Molecular Dynamics (MD): <span className="font-bold">several weeks</span> with H100 NVIDIA GPU or equivalent.
              </p>
            </div>
            <p className="mt-3 text-amber-700">A results link will be provided immediately upon submission where you can check the status and access your results once ready.</p>
          </div>
        </div>
      </div>

      {/* GlycoShield Papers */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-purple-800 flex-1">
            <p className="font-medium mb-2">Related Publications</p>
            <p className="mb-3">If you use GLACIER in your research, please cite our related publications:</p>
            <div className="space-y-2">
              <a 
                href="https://pubmed.ncbi.nlm.nih.gov/33319171/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 hover:underline"
              >
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                <span>Quantification of the Resilience and Vulnerability of HIV-1 Native Glycan Shield at Atomistic Detail</span>
              </a>
              <a 
                href="https://pubmed.ncbi.nlm.nih.gov/33093196/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 hover:underline"
              >
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                <span>Visualization of the HIV-1 Env glycan shield across scales</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Section - Collapsible */}
      <div className="border border-[#1A1A1A]/10 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleDocSection('documentation')}
          className="w-full flex items-center justify-between p-4 bg-[#F5F4F9]/50 hover:bg-[#F5F4F9] transition-colors"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-[#8B7DFF]" />
            <span className="font-medium text-[#1A1A1A]">GlycoShield Documentation & File Requirements</span>
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
              <h4 className="font-semibold text-[#1A1A1A] mb-2">The Glycan Shield Challenge</h4>
              <p className="leading-relaxed">
                Many clinically important enveloped viruses mask their surface proteins with a dense layer of host-derived sugars, known as the glycan shield. This sugar coating acts as a powerful immune evasion mechanism by sterically blocking antibody access to the underlying protein surface. Because these surface glycoproteins are the primary targets of neutralizing antibodies and vaccines, understanding how glycan shielding operates is central to rational immunogen design.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#1A1A1A] mb-2">Ensemble-Based Atomistic Modeling</h4>
              <p className="leading-relaxed">
                This platform employs an ensemble-based atomistic modeling approach (building on ALLOSMOD from Sali lab) to capture glycan behavior realistically. Starting from an experimentally determined protein scaffold, individual glycans are modeled at their glycosylation sites and extensively sampled using energy minimization and simulated annealing. Thousands of distinct conformations are generated to form an ensemble that represents the accessible conformational space of the fully glycosylated protein.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#1A1A1A] mb-2">Glycan Encounter Factor (GEF)</h4>
              <p className="leading-relaxed">
                Shielding is quantified using the Glycan Encounter Factor (GEF), which measures the probability that an approaching probe—representing the first line of antibody contact—encounters glycan atoms before reaching the protein surface. GEF produces spatial maps that distinguish persistently shielded regions from potential sites of vulnerability.
              </p>
            </div>

            {/* align.ali documentation */}
            <div className="border-t border-[#1A1A1A]/10 pt-4">
              <h4 className="font-semibold text-[#8B7DFF] mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Required Input: align.ali
              </h4>
              <p className="leading-relaxed mb-3">
                GlycoShield uses a MODELLER-style alignment file to define the relationship between template structures and the target protein. This alignment generates structural restraints during model construction and ensemble generation.
              </p>
              <div className="bg-[#F5F4F9]/50 p-3 rounded-lg space-y-2">
                <p className="font-medium text-[#1A1A1A]">File Format Requirements:</p>
                <ul className="list-disc list-inside space-y-1 text-[#1A1A1A]/70">
                  <li>Follow Sali Lab MODELLER alignment syntax</li>
                  <li>Contain one entry for each template PDB file plus one target sequence entry named <code className="bg-white px-1 rounded">pm.pdb</code></li>
                  <li>Each entry begins with a <code className="bg-white px-1 rounded">&gt;P1;</code> header</li>
                  <li>Alignment code must exactly match the corresponding PDB filename</li>
                  <li>Multiple chains: Specify by separating chains with <code className="bg-white px-1 rounded">/</code></li>
                  <li>Each sequence must end with a terminating <code className="bg-white px-1 rounded">*</code></li>
                </ul>
              </div>
              <div className="mt-3 bg-orange-50 border border-orange-200 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-orange-800">Critical: Alignment Quality</p>
                    <p className="text-orange-700 text-xs mt-1">
                      Small alignment errors can lead to large structural artifacts during simulation. Avoid misalignments where adjacent residues are aligned far apart, pay attention to chain termini where errors often occur, and ensure gaps and insertions are biologically reasonable.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* glyc.dat documentation */}
            <div className="border-t border-[#1A1A1A]/10 pt-4">
              <h4 className="font-semibold text-[#8B7DFF] mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Required Input: glyc.dat
              </h4>
              <p className="leading-relaxed mb-3">
                This file defines the explicit chemical structure of each glycan to be attached to the protein, specifying glycans at the monomer-by-monomer level following Sali Lab/MODELLER glycosylation format.
              </p>
              <div className="bg-[#F5F4F9]/50 p-3 rounded-lg space-y-3">
                <div>
                  <p className="font-medium text-[#1A1A1A] mb-1">File Structure:</p>
                  <p className="text-[#1A1A1A]/70 text-xs">One line per sugar monomer. Each line contains three columns: <code className="bg-white px-1 rounded">&lt;monomer_name&gt; &lt;bond_type&gt; &lt;attachment_residue_index&gt;</code></p>
                </div>
                <div>
                  <p className="font-medium text-[#1A1A1A] mb-1">Supported Monomers:</p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-[#1A1A1A]/70">
                    <span>• NAG – β-N-Acetyl-D-Glucosamine</span>
                    <span>• NGA – β-N-Acetyl-D-Galactosamine</span>
                    <span>• GLB – β-Galactose</span>
                    <span>• FUC – α-Fucose</span>
                    <span>• MAN – α-Mannose</span>
                    <span>• BMA – β-Mannose</span>
                    <span>• NAN – α-Neuraminic acid</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-[#1A1A1A] mb-1">Bond Types:</p>
                  <div className="text-xs text-[#1A1A1A]/70 space-y-1">
                    <p><strong>Protein–glycan:</strong> NGLA/NGLB (to ASN), SGPA/SGPB (to SER), TGPA/TGPB (to THR)</p>
                    <p><strong>Glycan–glycan:</strong> 16ab, 16fu, 14bb, 13ab, 13bb, 12aa, 12ba</p>
                    <p><strong>Sialic acid:</strong> sa23 (α 2→3), sa26 (α 2→6)</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 bg-gray-900 p-3 rounded-lg overflow-x-auto">
                <p className="text-xs text-gray-400 mb-2">Example: Mannose-9 at residue 58</p>
                <pre className="text-xs text-green-400 font-mono">{`NAG NGLB 58
NAG 14bb 1
BMA 14bb 2
MAN 13ab 3
MAN 16ab 3
MAN 13ab 5
MAN 16ab 5
MAN 12aa 7
MAN 12aa 6
MAN 12aa 4
MAN 12aa 10`}</pre>
              </div>
            </div>

            {/* input.dat documentation */}
            <div className="border-t border-[#1A1A1A]/10 pt-4">
              <h4 className="font-semibold text-[#8B7DFF] mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Required Input: input.dat
              </h4>
              <p className="leading-relaxed mb-3">
                Configuration file that specifies runtime parameters for the GlycoShield analysis pipeline.
              </p>
              <div className="bg-[#F5F4F9]/50 p-3 rounded-lg">
                <p className="font-medium text-[#1A1A1A] mb-1">Key Parameters:</p>
                <ul className="list-disc list-inside space-y-1 text-[#1A1A1A]/70 text-xs">
                  <li><code className="bg-white px-1 rounded">NRUNS</code> – Number of ensemble conformations to generate</li>
                  <li><code className="bg-white px-1 rounded">GEF_PROBE_RADIUS</code> – Probe radius for accessibility calculations (Å)</li>
                  <li><code className="bg-white px-1 rounded">DEVIATION</code> – Structural deviation parameter</li>
                  <li><code className="bg-white px-1 rounded">TEMPERATURE</code> – Simulation temperature (K)</li>
                  <li><code className="bg-white px-1 rounded">SAMPLING</code> – Sampling method (e.g., simulation)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* File Upload */}
      <div className="space-y-4">
        <Label className="text-[#1A1A1A] text-lg">
          Upload Files (Max {MAX_FILES})
          <span className="ml-2 text-xs font-normal text-[#1A1A1A]/60">
            Accepted: .pdb, .ali, .dat, .zip, .tar, .gz, .tgz, .cif, .fasta, .seq
          </span>
        </Label>
        <div className="border-2 border-dashed border-[#1A1A1A]/20 rounded-xl p-8 text-center hover:border-[#1A1A1A]/40 transition-colors bg-[#F5F4F9]/30">
          <Upload className="w-12 h-12 text-[#1A1A1A]/40 mx-auto mb-4" />
          <p className="text-[#1A1A1A]/70 mb-4 text-lg">
            Drag and drop files here or use the buttons below
          </p>

          {/* Example Run Link */}
          {files.length === 0 && (
            <div className="mb-4">
              {!showExampleSelector ? (
                <button
                  onClick={() => setShowExampleSelector(true)}
                  disabled={isLoadingExample}
                  className="text-[#8B7DFF] hover:text-[#8B7DFF]/80 underline text-sm transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                >
                  <FlaskRound className="w-4 h-4" />
                  Try an example run
                </button>
              ) : (
                <div className="bg-white border border-[#8B7DFF]/30 rounded-xl p-4 max-w-xl mx-auto shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-[#1A1A1A] flex items-center gap-2">
                      <FlaskRound className="w-4 h-4 text-[#8B7DFF]" />
                      Choose Example Dataset
                    </h4>
                    <button
                      onClick={() => setShowExampleSelector(false)}
                      className="text-[#1A1A1A]/40 hover:text-[#1A1A1A] p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* SARS-CoV-2 Option */}
                    <button
                      onClick={() => handleLoadExample('spikeD')}
                      disabled={isLoadingExample}
                      className="group p-3 border border-[#1A1A1A]/10 rounded-lg hover:border-[#8B7DFF] hover:bg-[#8B7DFF]/5 transition-all text-left disabled:opacity-50"
                    >
                      <div className="text-2xl mb-2">{EXAMPLE_OPTIONS.spikeD.icon}</div>
                      <h5 className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#8B7DFF]">
                        {EXAMPLE_OPTIONS.spikeD.shortName}
                      </h5>
                      <p className="text-xs text-[#1A1A1A]/60 mt-1">
                        SARS-CoV-2 D614G variant
                      </p>
                      <p className="text-xs text-[#8B7DFF] mt-2">4 files</p>
                    </button>
                    
                    {/* HIV BG505 Option */}
                    <button
                      onClick={() => handleLoadExample('bg505')}
                      disabled={isLoadingExample}
                      className="group p-3 border border-[#1A1A1A]/10 rounded-lg hover:border-[#8B7DFF] hover:bg-[#8B7DFF]/5 transition-all text-left disabled:opacity-50"
                    >
                      <div className="text-2xl mb-2">{EXAMPLE_OPTIONS.bg505.icon}</div>
                      <h5 className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#8B7DFF]">
                        {EXAMPLE_OPTIONS.bg505.shortName}
                      </h5>
                      <p className="text-xs text-[#1A1A1A]/60 mt-1">
                        HIV-1 envelope trimer
                      </p>
                      <p className="text-xs text-[#8B7DFF] mt-2">4 files</p>
                    </button>
                    
                    {/* Both Option */}
                    <button
                      onClick={() => handleLoadExample('both')}
                      disabled={isLoadingExample}
                      className="group p-3 border-2 border-[#8B7DFF]/30 rounded-lg hover:border-[#8B7DFF] hover:bg-[#8B7DFF]/5 transition-all text-left disabled:opacity-50 bg-[#8B7DFF]/5"
                    >
                      <div className="text-2xl mb-2">🧬🦠</div>
                      <h5 className="text-sm font-medium text-[#8B7DFF]">
                        Both Examples
                      </h5>
                      <p className="text-xs text-[#1A1A1A]/60 mt-1">
                        Multi-protein analysis
                      </p>
                      <p className="text-xs text-[#8B7DFF] mt-2">8 files (2 folders)</p>
                    </button>
                  </div>
                  
                  {isLoadingExample && (
                    <div className="mt-3 text-center text-sm text-[#8B7DFF]">
                      <span className="animate-spin inline-block mr-2">⏳</span>
                      Loading example files...
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => document.getElementById("folder-upload")?.click()}
              disabled={files.length >= MAX_FILES}
              className="bg-[#1A1A1A]/10 border border-[#1A1A1A]/20 text-[#1A1A1A] hover:bg-[#1A1A1A]/20 px-4 py-2"
            >
              <Folder className="w-4 h-4 mr-2" />
              Choose Folder
            </Button>
            <Button
              variant="outline"
              onClick={() => document.getElementById("pdb-upload")?.click()}
              disabled={files.length >= MAX_FILES}
              className="bg-[#8B7DFF]/20 border border-[#8B7DFF]/40 text-[#1A1A1A] hover:bg-[#8B7DFF]/30 px-4 py-2"
            >
              PDB Files Only
            </Button>
          </div>

          {/* File inputs */}
          <Input
            type="file"
            // @ts-ignore
            webkitdirectory=""
            directory=""
            onChange={handleFileUpload}
            className="hidden"
            id="folder-upload"
            disabled={files.length >= MAX_FILES}
          />
          <Input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="pdb-upload"
            disabled={files.length >= MAX_FILES}
            accept=".pdb"
          />
        </div>

        {/* Folder/File Display with Expandable Folders */}
        {folderConfigs.length > 0 && (
          <>
            <div className="space-y-2 mt-6">
              <h3 className="text-lg font-medium text-[#1A1A1A] mb-3">
                Uploaded Folders ({folderConfigs.length} folders, {files.length} files)
              </h3>
              
              <div className="space-y-2 max-h-[600px] overflow-y-auto border border-[#1A1A1A]/10 rounded-lg">
                {folderConfigs.map(folder => {
                  const isExpanded = expandedFolders.has(folder.name);
                  const folderPdbCount = folder.files.filter(f => isPDBFile(f.name)).length;
                  const missing = getMissingRequirements(folder);
                  const isExampleFolder = (folder.name === 'spikeD' || folder.name === 'bg505') && isExample;
                  
                  return (
                    <div key={folder.name} className="bg-white">
                      {/* Folder Header */}
                      <div className={`flex items-center justify-between p-3 hover:bg-gray-50 border-b ${
                        folder.status.isComplete ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'
                      }`}>
                        <div className="flex items-center gap-2 flex-1">
                          <button
                            onClick={() => toggleFolder(folder.name)}
                            className="text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                          </button>
                          <Folder className={`w-5 h-5 ${
                            folder.status.isComplete ? 'text-green-600' : 'text-red-600'
                          }`} />
                          <span className="font-medium text-[#1A1A1A]">{folder.name}</span>
                          {isExampleFolder && (
                            <span className="text-xs text-[#8B7DFF] font-medium ml-2">
                              (Example)
                            </span>
                          )}
                          <span className="text-xs text-[#1A1A1A]/50">
                            ({folder.files.length} files, {folderPdbCount} PDB)
                          </span>
                          {!folder.status.isComplete && (
                            <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Incomplete
                            </span>
                          )}
                          {folder.status.isComplete && (
                            <span className="text-xs text-green-600 font-medium">
                              ✓ Complete
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFolder(folder.name)}
                          className="text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/10 h-8 w-8 p-0 rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Folder Contents */}
                      {isExpanded && (
                        <div>
                          {/* Folder Configuration Panel */}
                          <FolderConfigPanel 
                            folder={folder} 
                            updateConfig={(updates) => updateFolderConfig(folder.name, updates)}
                          />
                          
                          {/* Folder Requirements Status */}
                          <div className="p-3 bg-white/50 border-t border-[#1A1A1A]/5">
                            <h5 className="text-xs font-medium text-[#1A1A1A] mb-2">Required Files:</h5>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center gap-1">
                                <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-medium text-white ${
                                  folder.status.hasPDB ? 'bg-green-500' : 'bg-red-500'
                                }`}>
                                  {folder.status.hasPDB ? '✓' : '✗'}
                                </span>
                                <span className={`text-xs ${
                                  folder.status.hasPDB ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  PDB file
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-medium text-white ${
                                  folder.status.hasALI ? 'bg-green-500' : 'bg-red-500'
                                }`}>
                                  {folder.status.hasALI ? '✓' : '✗'}
                                </span>
                                <span className={`text-xs ${
                                  folder.status.hasALI ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  ALI file
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-medium text-white ${
                                  folder.status.hasGlycDat ? 'bg-green-500' : 'bg-red-500'
                                }`}>
                                  {folder.status.hasGlycDat ? '✓' : '✗'}
                                </span>
                                <span className={`text-xs ${
                                  folder.status.hasGlycDat ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  glyc.dat
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-medium text-white ${
                                  folder.status.hasInputDat ? 'bg-green-500' : 'bg-red-500'
                                }`}>
                                  {folder.status.hasInputDat ? '✓' : '✗'}
                                </span>
                                <span className={`text-xs ${
                                  folder.status.hasInputDat ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  input.dat
                                </span>
                              </div>
                            </div>
                            {!folder.status.isComplete && (
                              <div className="mt-2 text-xs text-red-600">
                                Missing: {missing.join(', ')}
                              </div>
                            )}
                          </div>
                          
                          {/* File list */}
                          <div className="bg-[#F5F4F9]/30">
                            {folder.files.map((file, idx) => {
                              const isRequired = file.name.toLowerCase().endsWith('.pdb') ||
                                               file.name.toLowerCase().endsWith('.ali') ||
                                               file.name.toLowerCase() === 'glyc.dat' ||
                                               file.name.toLowerCase() === 'input.dat';
                              const isPDB = isPDBFile(file.name);
                              
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-3 pl-6 hover:bg-white/50 border-b border-[#1A1A1A]/5 last:border-b-0"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className={`inline-block w-2 h-2 rounded-full ${
                                      isRequired ? 'bg-green-500' : 'bg-gray-400'
                                    }`} />
                                    <File className={`w-4 h-4 ${
                                      isPDB ? 'text-[#8B7DFF]' : 'text-[#1A1A1A]/40'
                                    }`} />
                                    <span className="text-sm text-[#1A1A1A]">{file.name}</span>
                                    {isRequired && (
                                      <span className="text-xs text-green-600 font-medium">
                                        (Required)
                                      </span>
                                    )}
                                    {isPDB && (
                                      <span className="text-xs text-[#8B7DFF] font-medium">
                                        (PDB)
                                      </span>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(file)}
                                    className="text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/10 h-6 w-6 p-0 rounded-full"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Upload Summary */}
              <div className={`mt-4 p-4 border rounded-lg ${
                allComplete 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <h4 className="text-sm font-medium text-[#1A1A1A] mb-2">Upload Summary:</h4>
                <div className="text-sm text-[#1A1A1A]/70 space-y-1">
                  <p>• {folderConfigs.length} folder(s) uploaded</p>
                  <p>• {files.length} total file(s)</p>
                  <p>• {pdbCount} PDB file(s)</p>
                  {allComplete ? (
                    <p className="text-xs text-green-700 font-medium mt-2">
                      ✓ All folders have required files and individual configurations
                    </p>
                  ) : (
                    <p className="text-xs text-yellow-800 font-medium mt-2">
                      ⚠ {incompleteFolders.length} folder(s) missing required files
                    </p>
                  )}
                  <p className="text-xs text-[#1A1A1A]/60 mt-2">
                    Each folder will be processed with its own configuration settings
                  </p>
                </div>
              </div>
              
              {/* Global validation warning */}
              {!allComplete && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800 mb-1">
                        Incomplete Folders Detected
                      </h4>
                      <p className="text-xs text-red-700">
                        The following folders are missing required files and cannot be processed:
                      </p>
                      <ul className="mt-2 space-y-1">
                        {incompleteFolders.map(folder => {
                          const missing = getMissingRequirements(folder);
                          return (
                            <li key={folder.name} className="text-xs text-red-700">
                              <strong>{folder.name}:</strong> Missing {missing.join(', ')}
                            </li>
                          );
                        })}
                      </ul>
                      <p className="text-xs text-red-600 font-medium mt-2">
                        Please add the missing files or remove incomplete folders before proceeding.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* File Previews - Only shown for PDB files */}
        {pdbFiles.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[#1A1A1A] text-lg font-medium">File Previews</h3>
              <div className="text-xs text-[#1A1A1A]/70">
                {pdbFiles.length} PDB file(s)
              </div>
            </div>
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
              {pdbFiles.map((file, index) => {
                // Extract folder name from file
                const fileWithPath = file as FileWithPath;
                const path = fileWithPath.webkitRelativePath || (fileWithPath as any)._examplePath || '';
                const folderName = path ? path.split('/')[0] : 'Unknown Folder';
                
                return (
                  <FilePreview
                    key={index}
                    file={file}
                    folderName={folderName}
                    index={index}
                    totalFiles={pdbFiles.length}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Info Modal */}
      <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </div>
  )
}