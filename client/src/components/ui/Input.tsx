import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  error?: string
}

export function Input({ label, name, error, id, className = '', ...props }: InputProps) {
  const inputId = id ?? name
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`glass-panel rounded-md px-3 py-2 text-sm text-foreground outline-none transition-all focus:ring-2 placeholder:text-gray-400 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
            : 'focus:border-primary focus:ring-primary/20'
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}