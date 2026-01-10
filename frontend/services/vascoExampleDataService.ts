/**
 * VASCO Example Data Service
 * Provides example antibody and antigen files for demonstration purposes
 */

// Define the example file paths
const VASCO_EXAMPLE_FILES = {
  antibody: '/examples/2B4C/antibody.pdb',
  antigen: '/examples/2B4C/antigen.pdb'
}

// Example metadata for display
export const VASCO_EXAMPLE_DATA = {
  name: '2B4C Antibody-Antigen Complex',
  description: 'Example analysis using antibody-antigen complex from PDB 2B4C',
  lightChain: 'L',
  heavyChain: 'H',
  antigenChains: '',
  formData: {
    fullName: '',
    email: '',
    organization: 'SimBioSys Lab Demo',
    description: 'This is an example run demonstrating the VASCO interface prediction pipeline'
  }
}

/**
 * Fetch a file from a URL and convert to File object
 */
async function fetchFileAsBlob(url: string, filename: string): Promise<File> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filename}: ${response.status}`)
    }
    const blob = await response.blob()
    return new File([blob], filename, { type: blob.type || 'application/octet-stream' })
  } catch (error) {
    console.error(`Error fetching example file ${filename}:`, error)
    throw error
  }
}

/**
 * Load VASCO example files for the demo run
 */
export async function loadVascoExampleFiles(): Promise<{
  antibodyFile: File
  antigenFile: File
  lightChain: string
  heavyChain: string
  antigenChains: string
  formData: typeof VASCO_EXAMPLE_DATA.formData
}> {
  try {
    const [antibodyFile, antigenFile] = await Promise.all([
      fetchFileAsBlob(VASCO_EXAMPLE_FILES.antibody, 'antibody.pdb'),
      fetchFileAsBlob(VASCO_EXAMPLE_FILES.antigen, 'antigen.pdb')
    ])
    
    return {
      antibodyFile,
      antigenFile,
      lightChain: VASCO_EXAMPLE_DATA.lightChain,
      heavyChain: VASCO_EXAMPLE_DATA.heavyChain,
      antigenChains: VASCO_EXAMPLE_DATA.antigenChains,
      formData: VASCO_EXAMPLE_DATA.formData
    }
  } catch (error) {
    console.error('Failed to load VASCO example files:', error)
    throw new Error('Failed to load example files. Please try again.')
  }
}

/**
 * Check if the current files are example data
 */
export function isVascoExampleData(antibodyFile: File | null, antigenFile: File | null): boolean {
  if (!antibodyFile || !antigenFile) return false
  return antibodyFile.name === 'antibody.pdb' && antigenFile.name === 'antigen.pdb'
}
