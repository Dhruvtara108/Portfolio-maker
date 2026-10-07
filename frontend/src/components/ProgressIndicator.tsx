const steps = ['Information', 'Resume', 'Job Description', 'Review']

interface ProgressIndicatorProps {
  currentStep: number
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <nav aria-label="Portfolio creation progress" className="mx-auto mb-10 max-w-3xl">
      <ol className="flex items-start justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isComplete = stepNumber < currentStep

          return (
            <li className="relative flex flex-1 flex-col items-center gap-2" key={label}>
              {index < steps.length - 1 && (
                <span
                  className={`absolute left-1/2 top-4 h-px w-full ${
                    isComplete ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                />
              )}
              <span
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                  isActive
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : isComplete
                      ? 'border-indigo-600 bg-white text-indigo-600'
                      : 'border-slate-200 bg-white text-slate-400'
                }`}
              >
                {isComplete ? '✓' : stepNumber}
              </span>
              <span
                className={`text-center text-xs font-medium sm:text-sm ${
                  isActive || isComplete ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
