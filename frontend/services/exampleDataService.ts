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

// Example type for selection
export type ExampleType = 'spikeD' | 'bg505' | 'both'

// Individual example metadata
export const EXAMPLE_OPTIONS = {
  spikeD: {
    id: 'spikeD',
    name: 'SARS-CoV-2 Delta Spike',
    shortName: 'Delta Spike',
    description: 'SARS-CoV-2 spike protein D614G variant glycosylation analysis',
    icon: '🦠'
  },
  bg505: {
    id: 'bg505',
    name: 'HIV-1 BG505 SOSIP',
    shortName: 'BG505 SOSIP',
    description: 'HIV-1 BG505 envelope trimer glycan shield analysis',
    icon: '🧬'
  }
}

// Combined example metadata (for backward compatibility)
export const EXAMPLE_DATA = {
  name: 'Spike Protein D614G & BG505 HIV Envelope',
  description: 'Two example analyses: SARS-CoV-2 spike protein and HIV BG505 envelope protein glycosylation',
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
    return new File([blob], filename, { type: blob.type || 'application/octet-stream' })
  } catch (error) {
    console.error(`Error fetching example file ${filename}:`, error)
    throw error
  }
}

/**
 * Create file with path property
 */
function createFileWithPath(file: File, folder: string): File {
  const fileWithPath = new File([file], file.name, {
    type: file.type,
    lastModified: file.lastModified
  })
  
  Object.defineProperty(fileWithPath, '_examplePath', {
    value: `${folder}/${file.name}`,
    writable: false,
    enumerable: false
  })
  
  try {
    Object.defineProperty(fileWithPath, 'webkitRelativePath', {
      value: `${folder}/${file.name}`,
      writable: false,
      configurable: true
    })
  } catch (e) {
    console.log('Could not set webkitRelativePath, will use alternative method')
  }
  
  return fileWithPath
}

/**
 * Load example files for a specific example type
 */
export async function loadExampleFilesByType(type: ExampleType): Promise<{
  files: File[]
  formData: typeof EXAMPLE_DATA.formData
  exampleName: string
}> {
  try {
    const filesWithPath: File[] = []
    let exampleName = ''
    
    if (type === 'spikeD' || type === 'both') {
      const spikeDFiles = await Promise.all([
        fetchFileAsBlob(EXAMPLE_FILES.spikeD.pdb, 'start.pdb'),
        fetchFileAsBlob(EXAMPLE_FILES.spikeD.ali, 'align.ali'),
        fetchFileAsBlob(EXAMPLE_FILES.spikeD.glyc, 'glyc.dat'),
        fetchFileAsBlob(EXAMPLE_FILES.spikeD.input, 'input.dat')
      ])
      
      spikeDFiles.forEach(file => {
        filesWithPath.push(createFileWithPath(file, 'spikeD'))
      })
      
      exampleName = EXAMPLE_OPTIONS.spikeD.name
    }
    
    if (type === 'bg505' || type === 'both') {
      const bg505Files = await Promise.all([
        fetchFileAsBlob(EXAMPLE_FILES.bg505.pdb, 'bg505.pdb'),
        fetchFileAsBlob(EXAMPLE_FILES.bg505.ali, 'align.ali'),
        fetchFileAsBlob(EXAMPLE_FILES.bg505.glyc, 'glyc.dat'),
        fetchFileAsBlob(EXAMPLE_FILES.bg505.input, 'input.dat')
      ])
      
      bg505Files.forEach(file => {
        filesWithPath.push(createFileWithPath(file, 'bg505'))
      })
      
      if (type === 'both') {
        exampleName = 'SARS-CoV-2 Delta Spike & HIV-1 BG505 SOSIP'
      } else {
        exampleName = EXAMPLE_OPTIONS.bg505.name
      }
    }
    
    return {
      files: filesWithPath,
      formData: EXAMPLE_DATA.formData,
      exampleName
    }
  } catch (error) {
    console.error('Failed to load example files:', error)
    throw new Error('Failed to load example files. Please try again.')
  }
}

/**
 * Load all example files for the demo run (both spikeD and bg505)
 * @deprecated Use loadExampleFilesByType('both') instead
 */
export async function loadExampleFiles(): Promise<{
  files: File[]
  formData: typeof EXAMPLE_DATA.formData
}> {
  const result = await loadExampleFilesByType('both')
  return {
    files: result.files,
    formData: result.formData
  }
}

/**
 * Get download files list for a specific example type
 */
export function getExampleDownloadFiles(type: ExampleType) {
  const files: { url: string; name: string }[] = []
  
  if (type === 'spikeD' || type === 'both') {
    files.push(
      { url: '/examples/spikeD/start.pdb', name: 'spikeD_start.pdb' },
      { url: '/examples/spikeD/align.ali', name: 'spikeD_align.ali' },
      { url: '/examples/spikeD/glyc.dat', name: 'spikeD_glyc.dat' },
      { url: '/examples/spikeD/input.dat', name: 'spikeD_input.dat' }
    )
  }
  
  if (type === 'bg505' || type === 'both') {
    files.push(
      { url: '/examples/bg505/bg505.pdb', name: 'bg505_bg505.pdb' },
      { url: '/examples/bg505/align.ali', name: 'bg505_align.ali' },
      { url: '/examples/bg505/glyc.dat', name: 'bg505_glyc.dat' },
      { url: '/examples/bg505/input.dat', name: 'bg505_input.dat' }
    )
  }
  
  return files
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
