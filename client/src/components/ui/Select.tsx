import { SelectHTMLAttributes, useState, useRef, useEffect, forwardRef } from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string
  name: string
  options: SelectOption[]
  error?: string
  onChange?: (event: { target: { name: string; value: string } }) => void
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, name, options, error, id, className = '', onChange, value, defaultValue, ...props }, ref) => {
    const selectId = id ?? name
    const [isOpen, setIsOpen] = useState(false)
    const [internalValue, setInternalValue] = useState<string>((value ?? defaultValue ?? '') as string)
    const containerRef = useRef<HTMLDivElement>(null)

    // Sync external value
    useEffect(() => {
      if (value !== undefined) setInternalValue(value as string)
    }, [value])

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleOptionClick = (optionValue: string) => {
      setInternalValue(optionValue)
      setIsOpen(false)
      
      // Simulate synthetic event for compatibility
      if (onChange) {
        onChange({ target: { name, value: optionValue } })
      }
    }

    const selectedLabel = options.find(opt => opt.value === internalValue)?.label || 'Select option'

    return (
      <div className="flex flex-col gap-1.5" ref={containerRef}>
        <label htmlFor={selectId} className="text-sm font-medium text-foreground/80">
          {label}
        </label>
        
        {/* Hidden native select for form library integration */}
        <select
          id={selectId}
          name={name}
          ref={ref}
          value={internalValue}
          onChange={(e) => {
             setInternalValue(e.target.value)
             onChange?.({ target: { name, value: e.target.value } })
          }}
          className="sr-only"
          aria-hidden="true"
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom UI Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`glass-panel w-full rounded-md px-3 py-2.5 pr-10 text-left text-sm text-foreground outline-none transition-all focus:ring-2 ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                : 'focus:border-primary focus:ring-primary/20'
            } ${className}`}
          >
            <span className="block truncate">{selectedLabel}</span>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-foreground/50">
              <svg className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>

          {isOpen && (
            <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl glass-panel shadow-xl focus:outline-none border-white/20 p-1">
              {options.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  className={`relative cursor-pointer select-none py-2 pl-3 pr-9 text-sm rounded-lg transition-colors ${
                    internalValue === option.value
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-foreground hover:bg-primary/20 hover:text-primary'
                  }`}
                >
                  <span className="block truncate">{option.label}</span>
                  {internalValue === option.value && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-foreground">
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'