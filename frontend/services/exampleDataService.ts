/**
 * Example Data Service for GLACIER
 * Provides example files for demonstration purposes
 */

// Define the example file paths for both examples
const EXAMPLE_FILES = {
  spikeD: {
    pdb: '/examples/spikeD/start.pdb',
    ali: '/examples/spikeD/align.ali',
    glyc: '/examples/spikeD/glyc.dat',
    input: '/examples/spikeD/input.dat'
  },
  bg505: {
    pdb: '/examples/bg505/bg505.pdb',
    ali: '/examples/bg505/align.ali',
    glyc: '/examples/bg505/glyc.dat',
    input: '/examples/bg505/input.dat'
  }
}

// Example metadata for display
export const EXAMPLE_DATA = {
  name: 'Spike Protein D614G & BG505 HIV Envelope',
  description: 'Two example analyses: SARS-CoV-2 spike protein and HIV BG505 envelope protein glycosylation',
  // These values are not used anymore since we use per-folder configs
  // But keeping them for backward compatibility
  numberOfRuns: 1,
  GEFProbeRadius: 3,
  formData: {
    fullName: '',
    email: '',
    organization: 'SimBioSys Lab Demo',
    description: 'This is an example run demonstrating the GLACIER processing pipeline with multiple proteins'
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
 * Load all example files for the demo run (both spikeD and bg505)
 */
export async function loadExampleFiles(): Promise<{
  files: File[]
  formData: typeof EXAMPLE_DATA.formData
}> {
  try {
    // Fetch all example files from both folders in parallel
    const spikeDPromises = [
      fetchFileAsBlob(EXAMPLE_FILES.spikeD.pdb, 'start.pdb').then(file => ({ file, folder: 'spikeD' })),
      fetchFileAsBlob(EXAMPLE_FILES.spikeD.ali, 'align.ali').then(file => ({ file, folder: 'spikeD' })),
      fetchFileAsBlob(EXAMPLE_FILES.spikeD.glyc, 'glyc.dat').then(file => ({ file, folder: 'spikeD' })),
      fetchFileAsBlob(EXAMPLE_FILES.spikeD.input, 'input.dat').then(file => ({ file, folder: 'spikeD' }))
    ]
    
    const bg505Promises = [
      fetchFileAsBlob(EXAMPLE_FILES.bg505.pdb, 'bg505.pdb').then(file => ({ file, folder: 'bg505' })),
      fetchFileAsBlob(EXAMPLE_FILES.bg505.ali, 'align.ali').then(file => ({ file, folder: 'bg505' })),
      fetchFileAsBlob(EXAMPLE_FILES.bg505.glyc, 'glyc.dat').then(file => ({ file, folder: 'bg505' })),
      fetchFileAsBlob(EXAMPLE_FILES.bg505.input, 'input.dat').then(file => ({ file, folder: 'bg505' }))
    ]
    
    const allFileResults = await Promise.all([...spikeDPromises, ...bg505Promises])
    
    // Create files with a custom property to track folder path
    // We'll use Object.defineProperty to add a non-enumerable property
    const filesWithPath = allFileResults.map(({ file, folder }) => {
      // Create a new File object that extends the original
      const fileWithPath = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified
      })
      
      // Add a custom property for the path (not webkitRelativePath since it's read-only)
      Object.defineProperty(fileWithPath, '_examplePath', {
        value: `${folder}/${file.name}`,
        writable: false,
        enumerable: false
      })
      
      // Also try to add webkitRelativePath using defineProperty if possible
      try {
        Object.defineProperty(fileWithPath, 'webkitRelativePath', {
          value: `${folder}/${file.name}`,
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
  if (files.length !== 8) return false
  
  const fileNames = files.map(f => f.name).sort()
  const exampleFileNames = [
    'start.pdb', 'align.ali', 'glyc.dat', 'input.dat',  // spikeD
    'bg505.pdb', 'align.ali', 'glyc.dat', 'input.dat'  // bg505
  ].sort()
  
  return JSON.stringify(fileNames) === JSON.stringify(exampleFileNames)
}