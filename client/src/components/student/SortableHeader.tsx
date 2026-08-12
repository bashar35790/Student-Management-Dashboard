'use client'

interface SortableHeaderProps {
  label: string
  field: 'name' | 'createdAt' | 'class'
  sortBy: 'name' | 'createdAt' | 'class'
  sortOrder: 'asc' | 'desc'
  onSort: (field: 'name' | 'createdAt' | 'class') => void
  className?: string
}

export function SortableHeader({
  label,
  field,
  sortBy,
  sortOrder,
  onSort,
  className = '',
}: SortableHeaderProps) {
  const isActive = sortBy === field
  const indicator =
    isActive && sortOrder === 'asc' ? '▲' : isActive && sortOrder === 'desc' ? '▼' : ''

  return (
    <th className={className}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className="inline-flex items-center gap-1 font-semibold hover:text-primary transition-colors"
        aria-label={`Sort by ${label}`}
      >
        {label}
        <span className={isActive ? 'text-primary' : 'text-foreground/30'}>{indicator || '·'}</span>
      </button>
    </th>
  )
}