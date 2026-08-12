import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Spinner } from './Spinner'

type Variant = 'primary' | 'secondary' | 'danger' | 'dangerOutline' | 'ghost'
type Size = 'sm' | 'md'

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

const variantStyles: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-primary shadow-[0_4px_14px_0_rgba(255,45,95,0.39)] hover:shadow-[0_6px_20px_rgba(255,45,95,0.23)] hover:-translate-y-[1px] transition-all',
  secondary: 'glass-panel text-gray-800 dark:text-gray-200 hover:bg-white/40 dark:hover:bg-white/10 transition-all',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-[1px] transition-all',
  dangerOutline: 'glass-panel text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:hover:bg-red-900/20 transition-all',
  ghost: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-all',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5',
  md: 'px-4 py-2',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  )
}