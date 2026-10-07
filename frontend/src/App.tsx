import { useState } from 'react'
import { submitPortfolioDraft } from './api/portfolio'
import { ProgressIndicator } from './components/ProgressIndicator'
import { StepLayout } from './components/StepLayout'
import { CandidateInformation } from './pages/CandidateInformation'
import { JobDescription } from './pages/JobDescription'
import { LandingPage } from './pages/LandingPage'
import { Review } from './pages/Review'
import { ResumeUpload } from './pages/ResumeUpload'
import type { PortfolioDraft } from './types/portfolio'

const initialDraft: PortfolioDraft = {
  candidate: {
    fullName: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    linkedInUrl: '',
    githubUrl: '',
    websiteUrl: '',
  },
  resume: null,
  jobDescription: {
    mode: 'paste',
    text: '',
    file: null,
  },
}

function App() {
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<PortfolioDraft>(initialDraft)
  const [completed, setCompleted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submission, setSubmission] = useState<Awaited<ReturnType<typeof submitPortfolioDraft>> | null>(null)

  const updateDraft = (updates: Partial<PortfolioDraft>) => {
    setDraft((current) => ({ ...current, ...updates }))
  }

  if (step === 0) {
    return <LandingPage onStart={() => setStep(1)} />
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-950">
      <header className="border-b border-slate-200/80 bg-white/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
          <button
            className="flex items-center gap-3 text-left"
            onClick={() => setStep(0)}
            type="button"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-200">
              P
            </span>
            <span className="font-semibold tracking-tight">Portfolio Maker</span>
          </button>
          <span className="hidden text-sm text-slate-500 sm:block">Create your portfolio</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-14">
        <ProgressIndicator currentStep={step} />
        <StepLayout
          step={step}
          onBack={() => setStep((current) => Math.max(1, current - 1))}
        >
          {step === 1 && (
            <CandidateInformation
              value={draft.candidate}
              onChange={(candidate) => updateDraft({ candidate })}
              onContinue={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <ResumeUpload
              value={draft.resume}
              onChange={(resume) => updateDraft({ resume })}
              onContinue={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <JobDescription
              value={draft.jobDescription}
              onChange={(jobDescription) => updateDraft({ jobDescription })}
              onContinue={() => setStep(4)}
            />
          )}
          {step === 4 && (
            <Review
              draft={draft}
              completed={completed}
              isSubmitting={isSubmitting}
              error={submitError}
              submission={submission}
              onBuild={async () => {
                setIsSubmitting(true)
                setSubmitError('')
                try {
                  const result = await submitPortfolioDraft(draft)
                  setSubmission(result)
                  setCompleted(true)
                } catch (error) {
                  setSubmitError(error instanceof Error ? error.message : 'Unable to submit your portfolio draft.')
                } finally {
                  setIsSubmitting(false)
                }
              }}
            />
          )}
        </StepLayout>
      </main>
    </div>
  )
}

export default App
