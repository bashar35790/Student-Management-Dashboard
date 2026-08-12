import { Button } from './Button'
import { ExclamationTriangleIcon } from './icons'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = 'Unable to load students. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 glass-panel rounded-xl border-red-200/40 px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
        <ExclamationTriangleIcon className="h-8 w-8" />
      </span>
      <p className="text-base font-semibold text-foreground">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  )
}