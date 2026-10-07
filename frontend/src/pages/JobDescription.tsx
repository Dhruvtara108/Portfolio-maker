import { useState } from 'react'
import { FileDropzone } from '../components/FileDropzone'
import { StepActions } from '../components/StepActions'
import type { JobDescriptionData, JobDescriptionMode } from '../types/portfolio'

interface JobDescriptionProps {
  value: JobDescriptionData
  onChange: (value: JobDescriptionData) => void
  onContinue: () => void
}

const maxFileSize = 10 * 1024 * 1024
const allowedExtensions = ['.pdf', '.docx', '.txt']

export function JobDescription({ value, onChange, onContinue }: JobDescriptionProps) {
  const [error, setError] = useState('')
  const isValid = value.mode === 'paste' ? value.text.trim().length > 0 : Boolean(value.file)

  const changeMode = (mode: JobDescriptionMode) => {
    setError('')
    onChange({ ...value, mode })
  }

  const handleFileChange = (file: File | null) => {
    if (!file) {
      onChange({ ...value, file: null })
      setError('')
      return
    }
    const extension = `.${file.name.split('.').pop()?.toLowerCase()}`
    if (!allowedExtensions.includes(extension)) {
      setError('Please select a PDF, DOCX, or TXT file.')
      return
    }
    if (file.size > maxFileSize) {
      setError('This file is larger than 10 MB. Please choose a smaller file.')
      return
    }
    setError('')
    onChange({ ...value, file })
  }

  const handleContinue = () => {
    if (!isValid) {
      setError(value.mode === 'paste' ? 'Please paste the job description to continue.' : 'Please upload a job description to continue.')
      return
    }
    onContinue()
  }

  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Step 3 of 4</p>
      <h1 className="text-3xl font-bold tracking-tight">Add the job description</h1>
      <p className="mt-3 leading-7 text-slate-500">
        Tell us about the role you are targeting. This helps keep your story focused.
      </p>
      <div className="mt-8 flex rounded-xl bg-slate-100 p-1">
        {(['paste', 'upload'] as const).map((mode) => (
          <button
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              value.mode === mode ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
            key={mode}
            onClick={() => changeMode(mode)}
            type="button"
          >
            {mode === 'paste' ? 'Paste Job Description' : 'Upload Job Description'}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {value.mode === 'paste' ? (
          <textarea
            autoFocus
            className="input min-h-72 resize-y"
            onChange={(event) => {
              onChange({ ...value, text: event.target.value })
              setError('')
            }}
            placeholder="Paste the complete job description here..."
            value={value.text}
          />
        ) : (
          <FileDropzone
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            acceptedLabel="PDF, DOCX, or TXT"
            error={error}
            file={value.file}
            onFileChange={handleFileChange}
          />
        )}
      </div>
      {value.mode === 'paste' && error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
      <StepActions onContinue={handleContinue} />
    </div>
  )
}
