import type { SelectHTMLAttributes } from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  name: string
  options: SelectOption[]
  error?: string
}

export function Select({ label, name, options, error, id, className = '', ...props }: SelectProps) {
  const selectId = id ?? name
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-sm font-medium text-foreground/80">
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          name={name}
          aria-invalid={error ? true : undefined}
          className={`glass-panel appearance-none w-full rounded-md px-3 py-2.5 pr-10 text-sm text-foreground outline-none transition-all focus:ring-2 ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
              : 'focus:border-primary focus:ring-primary/20'
          } ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-background text-foreground">
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-foreground/50">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}