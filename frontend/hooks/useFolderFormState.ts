import { useState, useCallback } from 'react'
import { FormData } from '@/components/form/StepTwo'
import { FolderConfig, FolderWithFiles, DEFAULT_FOLDER_CONFIG } from '@/types/folderConfig'
import { readAndParseInputDat } from '@/utils/inputDatParser'

// Extended File type with webkitRelativePath
interface FileWithPath extends File {
  webkitRelativePath?: string;
  _examplePath?: string;
}

// Check if a folder has all required files
const checkFolderRequirements = (files: File[]) => {
  const fileNames = files.map(f => f.name.toLowerCase());
  
  const hasPDB = files.some(f => f.name.toLowerCase().endsWith('.pdb'));
  const hasALI = files.some(f => f.name.toLowerCase().endsWith('.ali'));
  const hasGlycDat = fileNames.includes('glyc.dat');
  const hasInputDat = fileNames.includes('input.dat');
  
  const missingFiles: string[] = [];
  if (!hasPDB) missingFiles.push('PDB file');
  if (!hasALI) missingFiles.push('ALI file');
  if (!hasGlycDat) missingFiles.push('glyc.dat');
  if (!hasInputDat) missingFiles.push('input.dat');
  
  return {
    isComplete: hasPDB && hasALI && hasGlycDat && hasInputDat,
    missingFiles,
    hasInputDat
  };
};

export const useFolderFormState = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [folders, setFolders] = useState<Map<string, FolderWithFiles>>(new Map())
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    organization: '',
    description: '',
  })

  // Process files and organize them into folders
  const processFiles = useCallback(async (newFiles: File[], isExample: boolean = false) => {
    const filesWithPath = newFiles as FileWithPath[];
    const folderMap = new Map<string, File[]>();
    
    // Group files by folder
    filesWithPath.forEach(file => {
      const path = file.webkitRelativePath || (file as any)._examplePath || '';
      const folderName = path ? path.split('/')[0] : (isExample ? 'spikeD' : 'Uploaded Files');
      
      if (!folderMap.has(folderName)) {
        folderMap.set(folderName, []);
      }
      folderMap.get(folderName)!.push(file);
    });
    
    // Create FolderWithFiles objects
    const newFolders = new Map<string, FolderWithFiles>();
    
    for (const [folderName, files] of folderMap) {
      const requirements = checkFolderRequirements(files);
      
      // Create default config for the folder
      let config: FolderConfig = {
        folderName,
        ...DEFAULT_FOLDER_CONFIG
      };
      
      // Check if folder has input.dat and parse it
      const inputDatFile = files.find(f => f.name.toLowerCase() === 'input.dat');
      if (inputDatFile) {
        try {
          const parsed = await readAndParseInputDat(inputDatFile);
          const valuesFromInputDat: { nruns?: boolean; attachGaps?: boolean } = {};
          
          if (parsed.nruns !== undefined) {
            config.numberOfRuns = parsed.nruns;
            valuesFromInputDat.nruns = true;
            console.log(`[${folderName}] Set NRUNS from input.dat: ${parsed.nruns}`);
          }
          
          if (parsed.attachGaps !== undefined) {
            config.attachGaps = parsed.attachGaps;
            valuesFromInputDat.attachGaps = true;
            console.log(`[${folderName}] Set ATTACH_GAPS from input.dat: ${parsed.attachGaps}`);
          }
          
          config.hasInputDat = true;
          config.valuesFromInputDat = valuesFromInputDat;
        } catch (error) {
          console.error(`Error parsing input.dat in folder ${folderName}:`, error);
        }
      }
      
      newFolders.set(folderName, {
        folderName,
        files,
        config,
        isComplete: requirements.isComplete,
        missingFiles: requirements.missingFiles
      });
    }
    
    return newFolders;
  }, []);

  // Add files to the form
  const addFiles = useCallback(async (newFiles: File[], isExample: boolean = false) => {
    const processedFolders = await processFiles(newFiles, isExample);
    
    setFolders(prevFolders => {
      const updatedFolders = new Map(prevFolders);
      
      // Merge new folders with existing ones
      for (const [folderName, folderData] of processedFolders) {
        if (updatedFolders.has(folderName)) {
          // Merge files if folder already exists
          const existingFolder = updatedFolders.get(folderName)!;
          const mergedFiles = [...existingFolder.files, ...folderData.files];
          const requirements = checkFolderRequirements(mergedFiles);
          
          updatedFolders.set(folderName, {
            ...existingFolder,
            files: mergedFiles,
            isComplete: requirements.isComplete,
            missingFiles: requirements.missingFiles
          });
        } else {
          updatedFolders.set(folderName, folderData);
        }
      }
      
      return updatedFolders;
    });
    
    // Select the first folder if none selected
    if (!selectedFolder && processedFolders.size > 0) {
      setSelectedFolder(Array.from(processedFolders.keys())[0]);
    }
  }, [processFiles, selectedFolder]);

  // Update folder config
  const updateFolderConfig = useCallback((folderName: string, updates: Partial<FolderConfig>) => {
    setFolders(prevFolders => {
      const updatedFolders = new Map(prevFolders);
      const folder = updatedFolders.get(folderName);
      
      if (folder) {
        updatedFolders.set(folderName, {
          ...folder,
          config: {
            ...folder.config,
            ...updates,
            // Clear "from input.dat" flag if value was manually changed
            valuesFromInputDat: {
              ...folder.config.valuesFromInputDat,
              ...(updates.numberOfRuns !== undefined ? { nruns: false } : {}),
              ...(updates.attachGaps !== undefined ? { attachGaps: false } : {})
            }
          }
        });
      }
      
      return updatedFolders;
    });
  }, []);

  // Remove a file from a folder
  const removeFile = useCallback((folderName: string, file: File) => {
    setFolders(prevFolders => {
      const updatedFolders = new Map(prevFolders);
      const folder = updatedFolders.get(folderName);
      
      if (folder) {
        const updatedFiles = folder.files.filter(f => f !== file);
        
        if (updatedFiles.length === 0) {
          // Remove folder if no files left
          updatedFolders.delete(folderName);
          
          // Select another folder if this was selected
          if (selectedFolder === folderName) {
            const remainingFolders = Array.from(updatedFolders.keys());
            setSelectedFolder(remainingFolders.length > 0 ? remainingFolders[0] : null);
          }
        } else {
          const requirements = checkFolderRequirements(updatedFiles);
          
          // Check if we removed input.dat
          if (file.name.toLowerCase() === 'input.dat') {
            folder.config.hasInputDat = false;
            folder.config.valuesFromInputDat = {};
          }
          
          updatedFolders.set(folderName, {
            ...folder,
            files: updatedFiles,
            isComplete: requirements.isComplete,
            missingFiles: requirements.missingFiles
          });
        }
      }
      
      return updatedFolders;
    });
  }, [selectedFolder]);

  // Remove entire folder
  const removeFolder = useCallback((folderName: string) => {
    setFolders(prevFolders => {
      const updatedFolders = new Map(prevFolders);
      updatedFolders.delete(folderName);
      
      // Select another folder if this was selected
      if (selectedFolder === folderName) {
        const remainingFolders = Array.from(updatedFolders.keys());
        setSelectedFolder(remainingFolders.length > 0 ? remainingFolders[0] : null);
      }
      
      return updatedFolders;
    });
  }, [selectedFolder]);

  // Clear all folders
  const clearAllFolders = useCallback(() => {
    setFolders(new Map());
    setSelectedFolder(null);
  }, []);

  // Get all files as a flat array (for backward compatibility)
  const getAllFiles = useCallback((): File[] => {
    const allFiles: File[] = [];
    folders.forEach(folder => {
      allFiles.push(...folder.files);
    });
    return allFiles;
  }, [folders]);

  const resetForm = useCallback(() => {
    setCurrentStep(1);
    clearAllFolders();
    setFormData({
      fullName: '',
      email: '',
      organization: '',
      description: '',
    });
  }, [clearAllFolders]);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 2));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const canProceedToNextStep = useCallback(() => {
    if (currentStep === 1) {
      // Must have at least one folder and all folders must be complete
      if (folders.size === 0) return false;
      
      for (const folder of folders.values()) {
        if (!folder.isComplete) return false;
      }
      
      return true;
    }
    return true;
  }, [currentStep, folders]);

  const canSubmit = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return formData.fullName.trim() !== '' && 
           formData.email.trim() !== '' && 
           emailRegex.test(formData.email) &&
           formData.organization.trim() !== '';
  }, [formData]);

  return {
    // State
    currentStep,
    folders,
    selectedFolder,
    formData,
    
    // Actions
    addFiles,
    updateFolderConfig,
    removeFile,
    removeFolder,
    clearAllFolders,
    setSelectedFolder,
    setFormData,
    getAllFiles,
    
    // Navigation
    nextStep,
    prevStep,
    resetForm,
    
    // Validators
    canProceedToNextStep,
    canSubmit,
  };
}
