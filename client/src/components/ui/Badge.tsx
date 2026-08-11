import type { ReactNode } from 'react'

export type BadgeTone = 'success' | 'muted' | 'accent'

const toneStyles: Record<BadgeTone, string> = {
  success: 'bg-green-100 text-green-800',
  muted: 'bg-gray-100 text-gray-700',
  accent: 'bg-blue-100 text-blue-800',
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