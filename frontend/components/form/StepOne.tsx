"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Upload, X, Folder, ChevronDown, ChevronRight, File, AlertCircle, FlaskRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FilePreview from "@/components/file-preview"
import { InfoModal, InfoButton } from "@/components/InfoModal"
import { loadExampleFiles, isExampleData, EXAMPLE_DATA } from "@/services/exampleDataService"
import { MAX_FILES } from "@/app/config"
import { validateFiles, getFileValidationMessage, isPDBFile } from "@/utils/fileValidation"

// Type for File with webkitRelativePath property
type FileWithPath = File & {
  webkitRelativePath?: string;
  _examplePath?: string; // Custom property for example files
}

interface StepOneProps {
  files: File[]
  numberOfRuns: number
  GEFProbeRadius: number
  onFilesChange: (files: File[]) => void
  onNumberOfRunsChange: (runs: number) => void
  onGEFProbeRadiusChange: (runs: number) => void
  onFormDataChange: (data: any) => void
}

// Group files by folder based on webkitRelativePath
const groupFilesByFolder = (files: FileWithPath[], isExample?: boolean) => {
  const folderGroups: Record<string, FileWithPath[]> = {};
  
  files.forEach(file => {
    // For example files, check _examplePath first, then webkitRelativePath
    const path = file.webkitRelativePath || (file as any)._examplePath || '';
    const folderName = path ? path.split('/')[0] : (isExample ? 'spikeD' : 'Uploaded Files');
    
    if (!folderGroups[folderName]) {
      folderGroups[folderName] = [];
    }
    folderGroups[folderName].push(file);
  });
  
  return folderGroups;
};

// Check if a folder has all required files
const checkFolderRequirements = (folderFiles: FileWithPath[]) => {
  const fileNames = folderFiles.map(f => f.name.toLowerCase());
  
  const hasPDB = folderFiles.some(f => f.name.toLowerCase().endsWith('.pdb'));
  const hasALI = folderFiles.some(f => f.name.toLowerCase().endsWith('.ali'));
  const hasGlycDat = fileNames.includes('glyc.dat');
  const hasInputDat = fileNames.includes('input.dat');
  
  return {
    hasPDB,
    hasALI,
    hasGlycDat,
    hasInputDat,
    isComplete: hasPDB && hasALI && hasGlycDat && hasInputDat
  };
};

// Get missing requirements for a folder
const getMissingFolderRequirements = (folderFiles: FileWithPath[]) => {
  const status = checkFolderRequirements(folderFiles);
  const missing: string[] = [];
  
  if (!status.hasPDB) missing.push('PDB file');
  if (!status.hasALI) missing.push('ALI file');
  if (!status.hasGlycDat) missing.push('glyc.dat');
  if (!status.hasInputDat) missing.push('input.dat');
  
  return missing;
};

// Check if all folders are complete
const allFoldersComplete = (folderGroups: Record<string, FileWithPath[]>) => {
  return Object.values(folderGroups).every(folderFiles => 
    checkFolderRequirements(folderFiles).isComplete
  );
};

export default function StepOne({
  files,
  numberOfRuns,
  GEFProbeRadius,
  onFilesChange,
  onNumberOfRunsChange,
  onGEFProbeRadiusChange,
  onFormDataChange
}: StepOneProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['Uploaded Files']));
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isLoadingExample, setIsLoadingExample] = useState(false);
  const [isExample, setIsExample] = useState(false);

  const handleLoadExample = async () => {
    setIsLoadingExample(true);
    try {
      const exampleData = await loadExampleFiles();
      onFilesChange(exampleData.files);
      onNumberOfRunsChange(exampleData.numberOfRuns);
      onGEFProbeRadiusChange(exampleData.GEFProbeRadius);
      onFormDataChange(exampleData.formData);
      setIsExample(true);
      
      // Auto-expand the example folder
      setExpandedFolders(new Set(['spikeD']));
      
      // Show success feedback
      console.log('Example files loaded successfully');
    } catch (error) {
      console.error('Failed to load example files:', error);
      alert('Failed to load example files. Please try again.');
    } finally {
      setIsLoadingExample(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setIsExample(false); // Clear example flag when new files are added
      
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
      // Check both webkitRelativePath and _examplePath for folder name
      const path = f.webkitRelativePath || (f as any)._examplePath || '';
      const folder = path ? path.split('/')[0] : (isExample ? 'spikeD' : 'Uploaded Files');
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

  const filesWithPath = files as FileWithPath[];
  const folderGroups = groupFilesByFolder(filesWithPath, isExample);
  const folderNames = Object.keys(folderGroups);
  
  // Filter PDB files for preview
  const pdbFiles = files.filter(f => isPDBFile(f.name))
  
  const pdbCount = files.filter(f => isPDBFile(f.name)).length;
  
  // Check if all folders are complete
  const allComplete = allFoldersComplete(folderGroups);
  const incompleteFolders = folderNames.filter(name => 
    !checkFolderRequirements(folderGroups[name]).isComplete
  );

  return (
    <motion.div
      key="step1"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h2 className="text-3xl md:text-4xl font-light text-[#1A1A1A]">
            Upload Files & Configure
          </h2>
          <InfoButton onClick={() => setShowInfoModal(true)} />
        </div>

      {/* Example Data Banner */}
      {isExample && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#8B7DFF]/10 to-blue-500/10 border border-[#8B7DFF]/30 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <FlaskRound className="w-5 h-5 text-[#8B7DFF]" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-[#1A1A1A]">
                Viewing Example Data: {EXAMPLE_DATA.name}
              </h4>
              <p className="text-xs text-[#1A1A1A]/70 mt-1">
                {EXAMPLE_DATA.description}
              </p>
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
        </motion.div>
      )}
        <p className="text-[#1A1A1A]/70">
          Upload your research files and configure analysis parameters
        </p>
        <p className="text-sm text-[#1A1A1A]/50 mt-2">
          Each folder must contain: At least one .pdb file, at least one .ali file, glyc.dat, and input.dat
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
        {folderNames.length > 0 && (
          <>
            <div className="space-y-2 mt-6">
              <h3 className="text-lg font-medium text-[#1A1A1A] mb-3">
                Uploaded Files ({files.length} total)
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto border border-[#1A1A1A]/10 rounded-lg">
                {folderNames.map(folderName => {
                const folderFiles = folderGroups[folderName];
                const isExpanded = expandedFolders.has(folderName);
                const folderPdbCount = folderFiles.filter(f => isPDBFile(f.name)).length;
                const folderStatus = checkFolderRequirements(folderFiles);
                const missing = getMissingFolderRequirements(folderFiles);
                
                // Check if this is the example folder
                        const isExampleFolder = folderName === 'spikeD' && isExample;
                        
                        return (
                    <div key={folderName} className="bg-white">
                      {/* Folder Header */}
                      <div className={`flex items-center justify-between p-3 hover:bg-gray-50 border-b ${
                        folderStatus.isComplete ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'
                      }`}>
                        <div className="flex items-center gap-2 flex-1">
                          <button
                            onClick={() => toggleFolder(folderName)}
                            className="text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                          </button>
                          <Folder className={`w-5 h-5 ${
                            folderStatus.isComplete ? 'text-green-600' : 'text-red-600'
                          }`} />
                          <span className="font-medium text-[#1A1A1A]">{folderName}</span>
                              {isExampleFolder && (
                                <span className="text-xs text-[#8B7DFF] font-medium ml-2">
                                  (Example)
                                </span>
                              )}
                          <span className="text-xs text-[#1A1A1A]/50">
                            ({folderFiles.length} files, {folderPdbCount} PDB)
                          </span>
                          {!folderStatus.isComplete && (
                            <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Incomplete
                            </span>
                          )}
                          {folderStatus.isComplete && (
                            <span className="text-xs text-green-600 font-medium">
                              ✓ Complete
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFolder(folderName)}
                          className="text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/10 h-8 w-8 p-0 rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Folder Contents */}
                      {isExpanded && (
                        <div className="bg-[#F5F4F9]/30">
                          {/* Per-folder requirements status */}
                          <div className="p-3 pl-12 bg-white/50 border-b border-[#1A1A1A]/5">
                            <h5 className="text-xs font-medium text-[#1A1A1A] mb-2">Folder Requirements:</h5>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center gap-1">
                                <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-medium text-white ${
                                  folderStatus.hasPDB ? 'bg-green-500' : 'bg-red-500'
                                }`}>
                                  {folderStatus.hasPDB ? '✓' : '✗'}
                                </span>
                                <span className={`text-xs ${
                                  folderStatus.hasPDB ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  PDB file
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-medium text-white ${
                                  folderStatus.hasALI ? 'bg-green-500' : 'bg-red-500'
                                }`}>
                                  {folderStatus.hasALI ? '✓' : '✗'}
                                </span>
                                <span className={`text-xs ${
                                  folderStatus.hasALI ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  ALI file
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-medium text-white ${
                                  folderStatus.hasGlycDat ? 'bg-green-500' : 'bg-red-500'
                                }`}>
                                  {folderStatus.hasGlycDat ? '✓' : '✗'}
                                </span>
                                <span className={`text-xs ${
                                  folderStatus.hasGlycDat ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  glyc.dat
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-medium text-white ${
                                  folderStatus.hasInputDat ? 'bg-green-500' : 'bg-red-500'
                                }`}>
                                  {folderStatus.hasInputDat ? '✓' : '✗'}
                                </span>
                                <span className={`text-xs ${
                                  folderStatus.hasInputDat ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  input.dat
                                </span>
                              </div>
                            </div>
                            {!folderStatus.isComplete && (
                              <div className="mt-2 text-xs text-red-600">
                                Missing: {missing.join(', ')}
                              </div>
                            )}
                          </div>
                          
                          {/* File list */}
                          {folderFiles.map((file, idx) => {
                            const isRequired = file.name.toLowerCase().endsWith('.pdb') ||
                                             file.name.toLowerCase().endsWith('.ali') ||
                                             file.name.toLowerCase() === 'glyc.dat' ||
                                             file.name.toLowerCase() === 'input.dat';
                            const isPDB = isPDBFile(file.name);
                            
                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 pl-12 hover:bg-white/50 border-b border-[#1A1A1A]/5 last:border-b-0"
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
                  <p>• {folderNames.length} folder(s) uploaded</p>
                  <p>• {files.length} total file(s)</p>
                  <p>• {pdbCount} PDB file(s)</p>
                  {allComplete ? (
                    <p className="text-xs text-green-700 font-medium mt-2">
                      ✓ All folders have required files
                    </p>
                  ) : (
                    <p className="text-xs text-yellow-800 font-medium mt-2">
                      ⚠ {incompleteFolders.length} folder(s) missing required files
                    </p>
                  )}
                  <p className="text-xs text-[#1A1A1A]/60 mt-2">
                    Each PDB file will be processed in its own folder on the server
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
                        {incompleteFolders.map(folderName => {
                          const missing = getMissingFolderRequirements(folderGroups[folderName]);
                          return (
                            <li key={folderName} className="text-xs text-red-700">
                              <strong>{folderName}:</strong> Missing {missing.join(', ')}
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
              {pdbFiles.map((file, index) => (
                <FilePreview
                  key={index}
                  file={file}
                  index={index}
                  totalFiles={pdbFiles.length}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Number of Runs */}
      <div className="space-y-3">
        <Label className="text-[#1A1A1A] text-lg">Number of Runs (1-1000)</Label>
        <Input
          type="number"
          min="1"
          max="1000"
          value={numberOfRuns === 0 ? '' : numberOfRuns}
          onChange={(e) => {
            const value = e.target.value
            if (value === '') {
              onNumberOfRunsChange(0)
            } else {
              const numValue = Number.parseInt(value)
              if (!isNaN(numValue)) {
                onNumberOfRunsChange(Math.max(1, Math.min(1000, numValue)))
              }
            }
          }}
          onBlur={(e) => {
            if (numberOfRuns === 0 || numberOfRuns < 1) {
              onNumberOfRunsChange(1)
            }
          }}
          className="bg-white/70 border-[#1A1A1A]/20 text-[#1A1A1A] placeholder-[#1A1A1A]/50 text-lg p-4 focus:border-[#8B7DFF] focus:ring-[#8B7DFF]/20"
        />
      </div>

      {/* GEF Probe Radius */}
      <div className="space-y-3">
        <Label className="text-[#1A1A1A] text-lg">GEF Probe Radius</Label>
        <div className="relative inline-block w-full">
          <Input
            type="number"
            min="1"
            max="10"
            value={GEFProbeRadius === 0 ? '' : GEFProbeRadius}
            onChange={(e) => {
              const value = e.target.value
              if (value === '') {
                onGEFProbeRadiusChange(0)
              } else {
                const numValue = Number.parseInt(value)
                if (!isNaN(numValue)) {
                  onGEFProbeRadiusChange(Math.max(1, Math.min(10, numValue)))
                }
              }
            }}
            onBlur={(e) => {
              if (GEFProbeRadius === 0 || GEFProbeRadius < 1) {
                onGEFProbeRadiusChange(3)
              }
            }}
            className="bg-white/70 border-[#1A1A1A]/20 text-[#1A1A1A] placeholder-[#1A1A1A]/50 text-lg p-4 focus:border-[#8B7DFF] focus:ring-[#8B7DFF]/20"
          />
          <span className="absolute left-[2.1rem] top-1/2 -translate-y-1/2 text-[#1A1A1A]/60 text-md pointer-events-none">
            Å
          </span>
        </div>
        <p className="text-sm text-[#1A1A1A]/60">
          The recommended value for GEF Probe Radius is 3 Å, read more about it from the article &nbsp;
          <a
            href="https://www.nature.com/articles/s41565-025-01966-5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B7DFF] hover:text-[#8B7DFF]/80"
          >
            here
          </a>
        </p>
      </div>

      {/* Info Modal */}
      <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </motion.div>
  )
}
