import { Button } from './Button'
import { InboxIcon, PlusIcon } from './icons'

interface EmptyStateProps {
  message?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  message = 'No students found.',
  description = 'Try adjusting your search or filters.',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 glass-panel rounded-xl border-dashed border-white/20 px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary border border-primary/20">
        <InboxIcon className="h-8 w-8" />
      </span>
      <p className="text-base font-semibold text-foreground">{message}</p>
      <p className="max-w-sm text-sm text-foreground/60">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" className="mt-2" onClick={onAction}>
          {actionLabel.includes('Add') ? <PlusIcon className="h-4 w-4" /> : null}
          {actionLabel}
        </Button>
      )}
    </div>
  )
}