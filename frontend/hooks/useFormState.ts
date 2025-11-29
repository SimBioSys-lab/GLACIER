import { useState, useCallback } from 'react'
import { FormData } from '@/components/form/StepTwo'
import { DEFAULT_GEF_PROBE_RADIUS, DEFAULT_RUN_COUNT } from '@/app/config'
import { FolderConfig, FileWithPath, FolderGroup } from '@/types/folderConfig'

// Group files by folder and create folder configurations
const groupFilesIntoFolders = (files: FileWithPath[]): FolderGroup[] => {
  const folderMap: Record<string, FileWithPath[]> = {};
  
  files.forEach(file => {
    const path = file.webkitRelativePath || (file as any)._examplePath || '';
    const folderName = path ? path.split('/')[0] : 'Uploaded Files';
    
    if (!folderMap[folderName]) {
      folderMap[folderName] = [];
    }
    folderMap[folderName].push(file);
  });
  
  // Convert to FolderGroup array
  return Object.entries(folderMap).map(([name, files]) => {
    const fileNames = files.map(f => f.name.toLowerCase());
    
    return {
      name,
      files,
      config: {
        folderName: name,
        numberOfRuns: DEFAULT_RUN_COUNT,
        gefProbeRadius: DEFAULT_GEF_PROBE_RADIUS,
        attachGaps: true,
        loadedFromInputDat: {}
      },
      status: {
        hasPDB: files.some(f => f.name.toLowerCase().endsWith('.pdb')),
        hasALI: files.some(f => f.name.toLowerCase().endsWith('.ali')),
        hasGlycDat: fileNames.includes('glyc.dat'),
        hasInputDat: fileNames.includes('input.dat'),
        isComplete: false // Will be computed
      }
    };
  }).map(folder => ({
    ...folder,
    status: {
      ...folder.status,
      isComplete: folder.status.hasPDB && folder.status.hasALI && 
                  folder.status.hasGlycDat && folder.status.hasInputDat
    }
  }));
};

// Check if all folders have required files
const allFoldersComplete = (folders: FolderGroup[]): boolean => {
  return folders.length > 0 && folders.every(folder => folder.status.isComplete);
};

export const useFormState = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [files, setFiles] = useState<File[]>([])
  const [folderConfigs, setFolderConfigs] = useState<FolderGroup[]>([])
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    organization: '',
    description: '',
  })

  // Update folder configurations when files change
  const updateFolderConfigs = useCallback((newFiles: File[], existingConfigs?: FolderGroup[]) => {
    const filesWithPath = newFiles as FileWithPath[];
    const newFolders = groupFilesIntoFolders(filesWithPath);
    
    // If we have existing configs, preserve the settings for folders that still exist
    if (existingConfigs) {
      const configMap = new Map(existingConfigs.map(f => [f.name, f.config]));
      newFolders.forEach(folder => {
        const existingConfig = configMap.get(folder.name);
        if (existingConfig) {
          // Preserve existing configuration
          folder.config = existingConfig;
        }
      });
    }
    
    setFolderConfigs(newFolders);
  }, []);

  // Set files and update folder configs
  const setFilesWithConfig = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
    updateFolderConfigs(newFiles, folderConfigs);
  }, [folderConfigs, updateFolderConfigs]);

  // Update config for a specific folder
  const updateFolderConfig = useCallback((folderName: string, updates: Partial<FolderConfig>) => {
    setFolderConfigs(prev => prev.map(folder => 
      folder.name === folderName 
        ? { ...folder, config: { ...folder.config, ...updates } }
        : folder
    ));
  }, []);

  const resetForm = useCallback(() => {
    setCurrentStep(1)
    setFiles([])
    setFolderConfigs([])
    setFormData({
      fullName: '',
      email: '',
      organization: '',
      description: '',
    })
  }, [])

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 2))
  }, [])

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }, [])

  const canProceedToNextStep = useCallback(() => {
    if (currentStep === 1) {
      return folderConfigs.length > 0 && allFoldersComplete(folderConfigs)
    }
    return true
  }, [currentStep, folderConfigs])

  const canSubmit = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    return formData.fullName.trim() !== '' && 
           formData.email.trim() !== '' && 
           emailRegex.test(formData.email) &&
           formData.organization.trim() !== ''
  }, [formData])

  return {
    // State
    currentStep,
    files,
    folderConfigs,
    formData,
    
    // Setters
    setFiles: setFilesWithConfig,
    updateFolderConfig,
    setFormData,
    
    // Actions
    nextStep,
    prevStep,
    resetForm,
    
    // Validators
    canProceedToNextStep,
    canSubmit,
  }
}
