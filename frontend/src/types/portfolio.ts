export type JobDescriptionMode = 'paste' | 'upload'

export interface CandidateInfo {
  fullName: string
  headline: string
  email: string
  phone: string
  location: string
  bio: string
  linkedInUrl: string
  githubUrl: string
  websiteUrl: string
}

export interface JobDescriptionData {
  mode: JobDescriptionMode
  text: string
  file: File | null
}

export interface PortfolioDraft {
  candidate: CandidateInfo
  resume: File | null
  jobDescription: JobDescriptionData
}
