import type { PortfolioDraft } from '../types/portfolio'

interface ReviewProps {
  draft: PortfolioDraft
  completed: boolean
  onBuild: () => void
}

export function Review({ draft, completed, onBuild }: ReviewProps) {
  const { candidate, resume, jobDescription } = draft
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Step 4 of 4</p>
      <h1 className="text-3xl font-bold tracking-tight">Review your details</h1>
      <p className="mt-3 leading-7 text-slate-500">
        Everything looks good? You can go back to make changes before starting.
      </p>
      <div className="mt-8 divide-y divide-slate-100 rounded-2xl border border-slate-200">
        <ReviewRow label="Candidate">
          <p className="font-semibold text-slate-800">{candidate.fullName}</p>
          <p className="text-sm text-slate-500">{candidate.headline}</p>
          <p className="mt-1 text-sm text-slate-500">{candidate.email}</p>
        </ReviewRow>
        <ReviewRow label="Resume">
          <p className="text-sm font-semibold text-slate-800">{resume?.name || 'No resume selected'}</p>
        </ReviewRow>
        <ReviewRow label="Job Description">
          <p className="text-sm font-semibold text-slate-800">
            {jobDescription.mode === 'paste' ? 'Pasted job description' : 'Uploaded job description'}
          </p>
          {jobDescription.file && <p className="mt-1 text-sm text-slate-500">{jobDescription.file.name}</p>}
        </ReviewRow>
      </div>
      {completed ? (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
          <p className="font-semibold text-emerald-800">Your portfolio generation pipeline will start here.</p>
          <p className="mt-1 text-sm text-emerald-700">This is a placeholder for the next phase.</p>
        </div>
      ) : (
        <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
          <button className="primary-button" onClick={onBuild} type="button">
            Build My Portfolio <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </div>
  )
}

function ReviewRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 p-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">{label}</p>
      <div>{children}</div>
    </div>
  )
}
