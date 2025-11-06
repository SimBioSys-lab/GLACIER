import { useState, useCallback } from 'react'
import { FormData } from '@/components/form/StepTwo'
import { DEFAULT_GEF_PROBE_RADIUS, DEFAULT_RUN_COUNT } from '@/app/config'

// Extended File type with webkitRelativePath
interface FileWithPath extends File {
  webkitRelativePath?: string;
}

// Group files by folder
const groupFilesByFolder = (files: FileWithPath[]) => {
  const folderGroups: Record<string, FileWithPath[]> = {};
  
  files.forEach(file => {
    const path = file.webkitRelativePath || '';
    const folderName = path ? path.split('/')[0] : 'Uploaded Files';
    
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
  
  return hasPDB && hasALI && hasGlycDat && hasInputDat;
};

// Check if all folders have required files
const allFoldersHaveRequiredFiles = (files: File[]) => {
  const filesWithPath = files as FileWithPath[];
  const folderGroups = groupFilesByFolder(filesWithPath);
  
  // If no files, return false
  if (Object.keys(folderGroups).length === 0) {
    return false;
  }
  
  // Check each folder has all required files
  return Object.values(folderGroups).every(folderFiles => 
    checkFolderRequirements(folderFiles)
  );
};

export const useFormState = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [files, setFiles] = useState<File[]>([])
  const [numberOfRuns, setNumberOfRuns] = useState(DEFAULT_RUN_COUNT)
  const [GEFProbeRadius, setGEFProbeRadius] = useState(DEFAULT_GEF_PROBE_RADIUS)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    organization: '',
    description: '',
  })

  const resetForm = useCallback(() => {
    setCurrentStep(1)
    setFiles([])
    setNumberOfRuns(DEFAULT_RUN_COUNT)
    setGEFProbeRadius(DEFAULT_GEF_PROBE_RADIUS)
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
      // Must have at least one file AND all folders must have required files
      return files.length > 0 && allFoldersHaveRequiredFiles(files)
    }
    return true
  }, [currentStep, files])

  const canSubmit = useCallback(() => {
    // Basic email validation regex
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
    numberOfRuns,
    GEFProbeRadius,
    formData,
    
    // Setters
    setFiles,
    setNumberOfRuns,
    setGEFProbeRadius,
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
