import type { ReactNode } from 'react'

type AlertVariant = 'success' | 'error' | 'info'

const variantStyles: Record<AlertVariant, string> = {
  success: 'glass border-green-200/50 bg-green-50/50 text-green-800 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/50',
  error: 'glass border-red-200/50 bg-red-50/50 text-red-800 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/50',
  info: 'glass border-blue-200/50 bg-blue-50/50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/50',
}

interface AlertProps {
  variant?: AlertVariant
  children: ReactNode
}

export function Alert({ variant = 'info', children }: AlertProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`rounded-md border px-4 py-3 text-sm ${variantStyles[variant]}`}
    >
      {children}
    </div>
  )
}