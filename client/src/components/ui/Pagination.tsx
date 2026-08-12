'use client'

import { Button } from './Button'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'

interface PaginationProps {
  page: number
  totalPages: number
  total?: number
  onPageChange: (page: number) => void
}

function getPageItems(page: number, totalPages: number): (number | 'ellipsis')[] {
  const siblings = 1
  const pages = new Set<number>([1, totalPages])
  for (let p = page - siblings; p <= page + siblings; p++) {
    if (p >= 1 && p <= totalPages) pages.add(p)
  }
  const sorted = [...pages].sort((a, b) => a - b)
  const items: (number | 'ellipsis')[] = []
  let prev = 0
  for (const p of sorted) {
    if (prev && p - prev > 1) items.push('ellipsis')
    items.push(p)
    prev = p
  }
  return items
}

export function Pagination({ page, totalPages, total, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const start = total ? (page - 1) * 10 + 1 : null
  const end = total ? Math.min(page * 10, total) : null

  return (
    <nav
      aria-label="Pagination"
      className="mt-4 flex flex-col gap-3 glass-panel rounded-xl p-3 border-white/20 shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="px-2 text-sm text-foreground/70">
        {total !== undefined ? (
          <>
            Showing <span className="font-medium text-foreground">{start}–{end}</span> of{' '}
            <span className="font-medium text-foreground">{total}</span> students
          </>
        ) : (
          <>
            Page <span className="font-medium text-foreground">{page}</span> of{' '}
            <span className="font-medium text-foreground">{totalPages}</span>
          </>
        )}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        {getPageItems(page, totalPages).map((item, index) =>
          item === 'ellipsis' ? (
            <span key={`e-${index}`} className="px-1.5 py-1 text-sm text-foreground/40">
              &hellip;
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? 'page' : undefined}
              className={`inline-flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-md px-2 text-sm font-medium transition-colors ${
                item === page
                  ? 'bg-primary text-primary-foreground shadow-[0_4px_14px_0_rgba(255,45,95,0.39)]'
                  : 'text-foreground/70 hover:bg-white/40 hover:text-primary dark:hover:bg-white/10'
              }`}
            >
              {item}
            </button>
          ),
        )}
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  )
}