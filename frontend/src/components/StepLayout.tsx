import type { ReactNode } from 'react'

interface StepLayoutProps {
  step: number
  onBack: () => void
  children: ReactNode
}

export function StepLayout({ step, onBack, children }: StepLayoutProps) {
  return (
    <section className="mx-auto max-w-2xl">
      {step > 1 && (
        <button
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
          onClick={onBack}
          type="button"
        >
          <span aria-hidden="true">←</span> Back
        </button>
      )}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        {children}
      </div>
    </section>
  )
}
