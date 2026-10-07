import { useState } from 'react'
import { StepActions } from '../components/StepActions'
import type { CandidateInfo } from '../types/portfolio'

interface CandidateInformationProps {
  value: CandidateInfo
  onChange: (value: CandidateInfo) => void
  onContinue: () => void
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const urlPattern = /^https?:\/\/\S+\.\S+/i

export function CandidateInformation({ value, onChange, onContinue }: CandidateInformationProps) {
  const [submitted, setSubmitted] = useState(false)
  const update = (field: keyof CandidateInfo, fieldValue: string) =>
    onChange({ ...value, [field]: fieldValue })
  const errors = {
    fullName: !value.fullName.trim() ? 'Full name is required.' : '',
    headline: !value.headline.trim() ? 'Professional headline is required.' : '',
    email: !emailPattern.test(value.email) ? 'Enter a valid email address.' : '',
    linkedInUrl: value.linkedInUrl && !urlPattern.test(value.linkedInUrl) ? 'Enter a valid URL.' : '',
    githubUrl: value.githubUrl && !urlPattern.test(value.githubUrl) ? 'Enter a valid URL.' : '',
    websiteUrl: value.websiteUrl && !urlPattern.test(value.websiteUrl) ? 'Enter a valid URL.' : '',
  }
  const hasErrors = Object.values(errors).some(Boolean)

  const handleSubmit = () => {
    setSubmitted(true)
    if (!hasErrors) onContinue()
  }

  return (
    <div>
      <StepHeading
        eyebrow="Step 1 of 4"
        title="Tell us about yourself"
        description="Start with the details you want your future employers to know."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" required error={submitted ? errors.fullName : ''}>
          <input
            className="input"
            onChange={(event) => update('fullName', event.target.value)}
            placeholder="Alex Morgan"
            value={value.fullName}
          />
        </Field>
        <Field label="Professional Headline" required error={submitted ? errors.headline : ''}>
          <input
            className="input"
            onChange={(event) => update('headline', event.target.value)}
            placeholder="Product Designer & Creative Thinker"
            value={value.headline}
          />
        </Field>
        <Field label="Email" required error={submitted ? errors.email : ''}>
          <input
            className="input"
            onChange={(event) => update('email', event.target.value)}
            placeholder="alex@example.com"
            type="email"
            value={value.email}
          />
        </Field>
        <Field label="Phone (optional)">
          <input
            className="input"
            onChange={(event) => update('phone', event.target.value)}
            placeholder="+1 555 000 0000"
            value={value.phone}
          />
        </Field>
        <Field label="Location">
          <input
            className="input"
            onChange={(event) => update('location', event.target.value)}
            placeholder="New York, NY"
            value={value.location}
          />
        </Field>
        <Field label="LinkedIn URL" error={submitted ? errors.linkedInUrl : ''}>
          <input
            className="input"
            onChange={(event) => update('linkedInUrl', event.target.value)}
            placeholder="https://linkedin.com/in/..."
            value={value.linkedInUrl}
          />
        </Field>
        <Field label="GitHub URL" error={submitted ? errors.githubUrl : ''}>
          <input
            className="input"
            onChange={(event) => update('githubUrl', event.target.value)}
            placeholder="https://github.com/..."
            value={value.githubUrl}
          />
        </Field>
        <Field label="Personal Website (optional)" error={submitted ? errors.websiteUrl : ''}>
          <input
            className="input"
            onChange={(event) => update('websiteUrl', event.target.value)}
            placeholder="https://yourwebsite.com"
            value={value.websiteUrl}
          />
        </Field>
        <Field className="sm:col-span-2" label="About / Bio">
          <textarea
            className="input min-h-32 resize-y"
            onChange={(event) => update('bio', event.target.value)}
            placeholder="A short introduction about your experience, strengths, and what motivates you."
            value={value.bio}
          />
        </Field>
      </div>
      <StepActions onContinue={handleSubmit} />
    </div>
  )
}

function StepHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-8">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">{eyebrow}</p>
      <h1 className="text-3xl font-bold tracking-tight text-slate-950">{title}</h1>
      <p className="mt-3 leading-7 text-slate-500">{description}</p>
    </div>
  )
}

function Field({
  label,
  required,
  error,
  className = '',
  children,
}: {
  label: string
  required?: boolean
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-indigo-600">*</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-red-600">{error}</span>}
    </label>
  )
}
