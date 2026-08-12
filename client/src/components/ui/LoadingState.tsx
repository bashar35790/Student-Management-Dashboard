function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center gap-4 border-b border-white/10 px-5 py-4 last:border-b-0">
      <div className="h-10 w-10 shrink-0 rounded-full bg-foreground/10" />
      <div className="flex flex-1 items-center gap-4">
        <div className="h-3.5 w-32 rounded bg-foreground/10 sm:w-40" />
        <div className="hidden h-3.5 w-52 rounded bg-foreground/10 md:block" />
        <div className="hidden h-3.5 w-24 rounded bg-foreground/10 lg:block" />
        <div className="hidden h-3.5 w-16 rounded bg-foreground/10 lg:block" />
      </div>
    </div>
  )
}

interface LoadingStateProps {
  message?: string
  variant?: 'list' | 'card'
}

export function LoadingState({ message = 'Loading students...', variant = 'list' }: LoadingStateProps) {
  return (
    <div
      className="glass-panel overflow-hidden rounded-xl border-white/20 shadow-lg"
      role="status"
      aria-live="polite"
    >
      {variant === 'card' ? (
        <div className="space-y-4 p-6 sm:p-8">
          <div className="flex animate-pulse items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-foreground/10" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded bg-foreground/10" />
              <div className="h-3.5 w-60 rounded bg-foreground/10" />
            </div>
          </div>
          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 animate-pulse rounded bg-foreground/10" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex animate-pulse items-center gap-4 border-b border-white/10 px-5 py-4">
            <div className="h-3.5 w-24 rounded bg-foreground/10" />
            <div className="ml-auto h-8 w-24 rounded-md bg-foreground/10" />
          </div>
          {[0, 1, 2, 3, 4].map((i) => (
            <SkeletonRow key={i} />
          ))}
        </>
      )}
      <span className="sr-only">{message}</span>
    </div>
  )
}