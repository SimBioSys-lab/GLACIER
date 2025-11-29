/**
 * Configuration for each folder
 */
export interface FolderConfig {
  folderName: string
  numberOfRuns: number
  gefProbeRadius: number
  attachGaps: boolean
  loadedFromInputDat?: {
    nruns?: boolean
    attachGaps?: boolean
    gefProbeRadius?: boolean
  }
}

export interface FileWithPath extends File {
  webkitRelativePath?: string
  _examplePath?: string
}

export interface FolderGroup {
  name: string
  files: FileWithPath[]
  config: FolderConfig
  status: {
    hasPDB: boolean
    hasALI: boolean
    hasGlycDat: boolean
    hasInputDat: boolean
    isComplete: boolean
  }
}
