interface StepActionsProps {
  onContinue: () => void
  label?: string
}

export function StepActions({ onContinue, label = 'Continue' }: StepActionsProps) {
  return (
    <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
      <button className="primary-button" onClick={onContinue} type="button">
        {label} <span aria-hidden="true">→</span>
      </button>
    </div>
  )
}
