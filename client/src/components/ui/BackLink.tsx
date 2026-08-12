import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowLeftIcon } from './icons'

interface BackLinkProps {
  href: string
  children: ReactNode
}

export function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
    >
      <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      {children}
    </Link>
  )
}