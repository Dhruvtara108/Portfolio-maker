import { useState } from 'react'
import { FileDropzone } from '../components/FileDropzone'
import { StepActions } from '../components/StepActions'

interface ResumeUploadProps {
  value: File | null
  onChange: (value: File | null) => void
  onContinue: () => void
}

const maxFileSize = 10 * 1024 * 1024
const allowedExtensions = ['.pdf', '.docx']

export function ResumeUpload({ value, onChange, onContinue }: ResumeUploadProps) {
  const [error, setError] = useState('')

  const handleChange = (file: File | null) => {
    if (!file) {
      setError('')
      onChange(null)
      return
    }
    const extension = `.${file.name.split('.').pop()?.toLowerCase()}`
    if (!allowedExtensions.includes(extension)) {
      setError('Please select a PDF or DOCX file.')
      return
    }
    if (file.size > maxFileSize) {
      setError('This file is larger than 10 MB. Please choose a smaller file.')
      return
    }
    setError('')
    onChange(file)
  }

  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Step 2 of 4</p>
      <h1 className="text-3xl font-bold tracking-tight">Upload your resume</h1>
      <p className="mt-3 leading-7 text-slate-500">
        Share your latest resume so your future portfolio can reflect your experience.
      </p>
      <div className="mt-8">
        <FileDropzone
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          acceptedLabel="PDF or DOCX"
          error={error}
          file={value}
          onFileChange={handleChange}
        />
      </div>
      <StepActions onContinue={onContinue} />
    </div>
  )
}
