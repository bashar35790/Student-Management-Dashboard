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
  
  const renderIcon = () => {
    if (isActive && sortOrder === 'asc') {
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
      )
    }
    if (isActive && sortOrder === 'desc') {
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      )
    }
    return (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
      </svg>
    )
  }

  return (
    <th className={className}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className="inline-flex items-center gap-1.5 font-semibold hover:text-primary transition-colors group"
        aria-label={`Sort by ${label}`}
      >
        {label}
        <span className={`transition-colors ${isActive ? 'text-primary' : 'text-foreground/30 group-hover:text-primary/70'}`}>
          {renderIcon()}
        </span>
      </button>
    </th>
  )
}