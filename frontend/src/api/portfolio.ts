import type { PortfolioDraft } from '../types/portfolio'

export interface PortfolioDraftResponse {
  success: boolean
  message: string
  candidate: {
    full_name: string
    professional_headline: string
  }
  resume: {
    filename: string
    size: number
  }
  job_description: {
    source: 'text' | 'file'
    filename?: string
  }
}

const apiBaseUrl = 'http://localhost:8000'

export async function submitPortfolioDraft(draft: PortfolioDraft): Promise<PortfolioDraftResponse> {
  const formData = new FormData()
  const { candidate, jobDescription, resume } = draft

  formData.append('full_name', candidate.fullName)
  formData.append('professional_headline', candidate.headline)
  formData.append('email', candidate.email)
  formData.append('phone', candidate.phone)
  formData.append('location', candidate.location)
  formData.append('about', candidate.bio)
  formData.append('linkedin_url', candidate.linkedInUrl)
  formData.append('github_url', candidate.githubUrl)
  formData.append('website_url', candidate.websiteUrl)

  if (resume) formData.append('resume', resume)
  if (jobDescription.mode === 'paste') {
    formData.append('job_description_text', jobDescription.text)
  } else if (jobDescription.file) {
    formData.append('job_description_file', jobDescription.file)
  }

  const response = await fetch(`${apiBaseUrl}/api/portfolio/draft`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const detail = typeof errorBody?.detail === 'string'
      ? errorBody.detail
      : 'Unable to submit your portfolio draft.'
    throw new Error(detail)
  }

  return response.json() as Promise<PortfolioDraftResponse>
}
