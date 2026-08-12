import type { ReactNode } from 'react'

export type BadgeTone = 'success' | 'muted' | 'accent'

const toneStyles: Record<BadgeTone, string> = {
  success: 'glass border-green-200/50 bg-green-100/50 text-green-800 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50',
  muted: 'glass border-gray-200/50 bg-gray-100/50 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700/50',
  accent: 'glass border-blue-200/50 bg-blue-100/50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50',
}

interface BadgeProps {
  tone?: BadgeTone
  children: ReactNode
}

export function Badge({ tone = 'muted', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${toneStyles[tone]}`}
    >
      {children}
    </span>
  )
}