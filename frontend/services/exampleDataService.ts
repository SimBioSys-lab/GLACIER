/**
 * Example Data Service for GlycoMap
 * Provides example files for demonstration purposes
 */

// Define the example file paths
const EXAMPLE_FILES = {
  pdb: '/examples/spikeD/start.pdb',
  ali: '/examples/spikeD/align.ali',
  glyc: '/examples/spikeD/glyc.dat',
  input: '/examples/spikeD/input.dat'
}

// Example metadata for display
export const EXAMPLE_DATA = {
  name: 'Spike Protein D614G',
  description: 'SARS-CoV-2 spike protein glycosylation analysis example',
  numberOfRuns: 1,
  GEFProbeRadius: 3,
  formData: {
    fullName: '',
    email: '',
    organization: 'SimBioSys Lab Demo',
    description: 'This is an example run demonstrating the GlycoMap processing pipeline'
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
    // Create a File object with the blob data
    return new File([blob], filename, { type: blob.type || 'application/octet-stream' })
  } catch (error) {
    console.error(`Error fetching example file ${filename}:`, error)
    throw error
  }
}

/**
 * Load all example files for the demo run
 */
export async function loadExampleFiles(): Promise<{
  files: File[]
  numberOfRuns: number
  GEFProbeRadius: number
  formData: typeof EXAMPLE_DATA.formData
}> {
  try {
    // Fetch all example files in parallel
    const filePromises = [
      fetchFileAsBlob(EXAMPLE_FILES.pdb, 'start.pdb'),
      fetchFileAsBlob(EXAMPLE_FILES.ali, 'align.ali'),
      fetchFileAsBlob(EXAMPLE_FILES.glyc, 'glyc.dat'),
      fetchFileAsBlob(EXAMPLE_FILES.input, 'input.dat')
    ]
    
    const files = await Promise.all(filePromises)
    
    // Create files with a custom property to track folder path
    // We'll use Object.defineProperty to add a non-enumerable property
    const filesWithPath = files.map(file => {
      // Create a new File object that extends the original
      const fileWithPath = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified
      })
      
      // Add a custom property for the path (not webkitRelativePath since it's read-only)
      Object.defineProperty(fileWithPath, '_examplePath', {
        value: `spikeD/${file.name}`,
        writable: false,
        enumerable: false
      })
      
      // Also add webkitRelativePath using defineProperty if possible
      try {
        Object.defineProperty(fileWithPath, 'webkitRelativePath', {
          value: `spikeD/${file.name}`,
          writable: false,
          configurable: true
        })
      } catch (e) {
        // If we can't set webkitRelativePath, we'll handle it in the UI
        console.log('Could not set webkitRelativePath, will use alternative method')
      }
      
      return fileWithPath
    })
    
    return {
      files: filesWithPath,
      numberOfRuns: EXAMPLE_DATA.numberOfRuns,
      GEFProbeRadius: EXAMPLE_DATA.GEFProbeRadius,
      formData: EXAMPLE_DATA.formData
    }
  } catch (error) {
    console.error('Failed to load example files:', error)
    throw new Error('Failed to load example files. Please try again.')
  }
}

/**
 * Check if the current session is using example data
 */
export function isExampleData(files: File[]): boolean {
  if (files.length !== 4) return false
  
  const fileNames = files.map(f => f.name).sort()
  const exampleFileNames = ['start.pdb', 'align.ali', 'glyc.dat', 'input.dat'].sort()
  
  return JSON.stringify(fileNames) === JSON.stringify(exampleFileNames)
}
