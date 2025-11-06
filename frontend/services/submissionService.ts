import { UPLOAD_ENDPOINT } from '@/app/config'
import { FormData as FormDataType } from '@/components/form/StepTwo'

export interface SubmissionData {
  files: File[]
  numberOfRuns: number
  GEFProbeRadius: number
  formData: FormDataType
}

export interface SubmissionResponse {
  job_ids: string[]
  message?: string
}

// Extended File type with webkitRelativePath
interface FileWithPath extends File {
  webkitRelativePath?: string;
}

export class SubmissionService {
  static async submit(data: SubmissionData): Promise<SubmissionResponse> {
    const formData = new FormData()
    
    // Add files with their folder paths
    data.files.forEach((file, index) => {
      const fileWithPath = file as FileWithPath
      const folderPath = fileWithPath.webkitRelativePath || ''
      const folderName = folderPath ? folderPath.split('/')[0] : 'default'
      
      formData.append('files', file)
      formData.append(`file_folders`, folderName)  // Send folder name for each file
    })
    
    // Add form fields
    formData.append('name', data.formData.fullName)
    formData.append('email', data.formData.email)
    formData.append('organization', data.formData.organization)
    formData.append('description', data.formData.description)
    formData.append('numberOfRuns', data.numberOfRuns.toString())
    formData.append('GEFProbeRadius', data.GEFProbeRadius.toString())
    
    try {
      const response = await fetch(UPLOAD_ENDPOINT, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Server responded with ${response.status}: ${errorText}`)
      }
      
      const responseData: SubmissionResponse = await response.json()
      return responseData
    } catch (error: any) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Connection to the server failed. Please ensure the backend server is running on port 8000.')
      }
      throw error
    }
  }
}
