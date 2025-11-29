/**
 * Parser for input.dat files
 * Extracts NRUNS and ATTACH_GAPS values
 */

export interface InputDatValues {
  nruns?: number
  attachGaps?: boolean
}

/**
 * Parse input.dat file content to extract NRUNS and ATTACH_GAPS values
 * @param content - The text content of the input.dat file
 * @returns Object containing parsed values
 */
export function parseInputDat(content: string): InputDatValues {
  const result: InputDatValues = {}
  
  // Split content into lines
  const lines = content.split('\n')
  
  for (const line of lines) {
    // Remove comments and trim whitespace
    const cleanLine = line.split('#')[0].trim()
    
    if (!cleanLine) continue
    
    // Parse NRUNS
    if (cleanLine.startsWith('NRUNS')) {
      const match = cleanLine.match(/NRUNS\s*=\s*(\d+)/i)
      if (match) {
        const value = parseInt(match[1], 10)
        if (!isNaN(value) && value >= 1 && value <= 1000) {
          result.nruns = value
        }
      }
    }
    
    // Parse ATTACH_GAPS
    if (cleanLine.startsWith('ATTACH_GAPS')) {
      const match = cleanLine.match(/ATTACH_GAPS\s*=\s*(True|False|true|false|TRUE|FALSE|1|0)/i)
      if (match) {
        const value = match[1].toLowerCase()
        result.attachGaps = value === 'true' || value === '1'
      }
    }
  }
  
  return result
}

/**
 * Read and parse an input.dat File object
 * @param file - The File object to read and parse
 * @returns Promise resolving to parsed values
 */
export async function readAndParseInputDat(file: File): Promise<InputDatValues> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const parsed = parseInputDat(content)
        resolve(parsed)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read input.dat file'))
    }
    
    reader.readAsText(file)
  })
}
