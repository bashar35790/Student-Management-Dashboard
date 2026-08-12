import type { ReactNode } from 'react'
import { CheckCircleIcon, ExclamationTriangleIcon, InfoCircleIcon, XIcon } from './icons'

type AlertVariant = 'success' | 'error' | 'info'

const variantStyles: Record<AlertVariant, string> = {
  success: 'glass border-green-200/50 bg-green-50/50 text-green-800 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/50',
  error: 'glass border-red-200/50 bg-red-50/50 text-red-800 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/50',
  info: 'glass border-blue-200/50 bg-blue-50/50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/50',
}

const variantIcons: Record<AlertVariant, ReactNode> = {
  success: <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />,
  error: <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0" />,
  info: <InfoCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />,
}

interface AlertProps {
  variant?: AlertVariant
  children: ReactNode
  onDismiss?: () => void
}

export function Alert({ variant = 'info', children, onDismiss }: AlertProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-md border px-4 py-3 text-sm ${variantStyles[variant]}`}
    >
      {variantIcons[variant]}
      <div className="flex-1">{children}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="shrink-0 cursor-pointer rounded p-0.5 opacity-70 transition-opacity hover:opacity-100"
        >
          <XIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}