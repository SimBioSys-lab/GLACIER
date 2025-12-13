"use client"

import React, { useState, useEffect } from "react"
import { Upload, X, Folder, ChevronDown, ChevronRight, File, AlertCircle, FlaskRound, Download, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FilePreview from "@/components/file-preview"
import { InfoModal, InfoButton } from "@/components/InfoModal"
import { loadExampleFiles, isExampleData, EXAMPLE_DATA } from "@/services/exampleDataService"
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

// Helper function to download all example files (both folders)
const downloadExampleFiles = () => {
  const files = [
    // SpikeD files
    { url: '/examples/spikeD/start.pdb', name: 'spikeD_start.pdb' },
    { url: '/examples/spikeD/align.ali', name: 'spikeD_align.ali' },
    { url: '/examples/spikeD/glyc.dat', name: 'spikeD_glyc.dat' },
    { url: '/examples/spikeD/input.dat', name: 'spikeD_input.dat' },
    // BG505 files
    { url: '/examples/bg505/bg505.pdb', name: 'bg505_bg505.pdb' },
    { url: '/examples/bg505/align.ali', name: 'bg505_align.ali' },
    { url: '/examples/bg505/glyc.dat', name: 'bg505_glyc.dat' },
    { url: '/examples/bg505/input.dat', name: 'bg505_input.dat' }
  ]

  // Download each file with a small delay to prevent blocking
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
            Number of Runs
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
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isLoadingExample, setIsLoadingExample] = useState(false);
  const [isExample, setIsExample] = useState(false);
  const [isDownloadingExample, setIsDownloadingExample] = useState(false);

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

  const handleLoadExample = async () => {
    setIsLoadingExample(true);
    try {
      const exampleData = await loadExampleFiles();
      onFilesChange(exampleData.files);
      onFormDataChange(exampleData.formData);
      setIsExample(true);
      
      // Auto-expand both example folders
      setExpandedFolders(new Set(['spikeD', 'bg505']));
      
      console.log('Example files loaded successfully');
    } catch (error) {
      console.error('Failed to load example files:', error);
      alert('Failed to load example files. Please try again.');
    } finally {
      setIsLoadingExample(false);
    }
  };

  const handleDownloadExample = () => {
    setIsDownloadingExample(true);
    console.log('Starting download of example files...');
    downloadExampleFiles();
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
                Viewing Example Data: {EXAMPLE_DATA.name}
              </h4>
              <p className="text-xs text-[#1A1A1A]/70 mt-1">
                {EXAMPLE_DATA.description}
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
                  Download all 8 example files (2 folders) to your computer
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onFilesChange([]);
                setIsExample(false);
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
            <button
              onClick={handleLoadExample}
              disabled={isLoadingExample}
              className="text-[#8B7DFF] hover:text-[#8B7DFF]/80 underline text-sm mb-4 transition-colors disabled:opacity-50"
            >
              {isLoadingExample ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Loading example...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <FlaskRound className="w-4 h-4" />
                  Try an example run
                </span>
              )}
            </button>
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