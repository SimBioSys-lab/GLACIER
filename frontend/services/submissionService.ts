import type { IFormData } from '@/types/formTypes'
import type { FolderGroup } from '@/types/folderConfig'
import { API_URL } from '@/app/config'

interface SubmissionData {
  files: File[]
  folderConfigs: FolderGroup[]
  formData: IFormData
}

interface SubmissionResponse {
  job_ids: string[]
  message?: string
  azure_folder_url?: string
}

export class SubmissionService {
  static async submit(data: SubmissionData): Promise<SubmissionResponse> {
    const formDataToSend = new FormData()
    
    // Build parallel arrays for files and their folder names
    const allFiles: File[] = []
    const fileFolders: string[] = []
    
    // Iterate through each folder and collect files with their folder names
    data.folderConfigs.forEach(folder => {
      folder.files.forEach(file => {
        allFiles.push(file)
        fileFolders.push(folder.name)
      })
    })
    
    // Add all files to FormData
    allFiles.forEach((file) => {
      formDataToSend.append('files', file)
    })
    
    // Add file_folders array - one folder name per file (required by backend)
    fileFolders.forEach((folderName) => {
      formDataToSend.append('file_folders', folderName)
    })
    
    // Add form data - use 'name' instead of 'fullName' to match backend
    formDataToSend.append('name', data.formData.fullName || '')
    formDataToSend.append('email', data.formData.email || '')
    formDataToSend.append('organization', data.formData.organization || '')
    formDataToSend.append('description', data.formData.description || '')
    
    // Send per-folder configurations as JSON
    // Backend will parse this to apply folder-specific settings
    const folderConfigsData = data.folderConfigs.map(folder => ({
      folderName: folder.name,
      numberOfRuns: folder.config.numberOfRuns || 1,
      gefProbeRadius: folder.config.gefProbeRadius || 3,
      attachGaps: folder.config.attachGaps !== false
    }))
    formDataToSend.append('folder_configs', JSON.stringify(folderConfigsData))
    
    // Also send global defaults for backward compatibility
    // Backend should prefer per-folder configs when available
    if (data.folderConfigs.length > 0) {
      const firstConfig = data.folderConfigs[0].config
      formDataToSend.append('numberOfRuns', (firstConfig.numberOfRuns || 1).toString())
      formDataToSend.append('GEFProbeRadius', (firstConfig.gefProbeRadius || 3).toString())
    } else {
      formDataToSend.append('numberOfRuns', '1')
      formDataToSend.append('GEFProbeRadius', '3')
    }
    
    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formDataToSend,
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          detail: 'An error occurred during submission' 
        }))
        
        // Better error message formatting
        let errorMessage = 'An error occurred during submission'
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            // FastAPI validation errors are arrays of objects
            errorMessage = errorData.detail.map((err: any) => 
              `${err.loc?.join('.') || 'Field'}: ${err.msg}`
            ).join(', ')
          } else if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail
          } else if (typeof errorData.detail === 'object') {
            errorMessage = JSON.stringify(errorData.detail)
          }
        }
        
        throw new Error(errorMessage)
      }
      
      const result = await response.json()
      console.log('Raw backend response:', result)
      console.log('Azure URL in response:', result.azure_folder_url)
      
      // Create return value
      const returnValue = {
        job_ids: result.job_ids || [result.job_id] || [],
        azure_folder_url: result.azure_folder_url
      }
      
      console.log('Returning from SubmissionService:', returnValue)
      
      return returnValue
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to submit form')
    }
  }
}

export default SubmissionService