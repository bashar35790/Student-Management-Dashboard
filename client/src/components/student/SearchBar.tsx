'use client'

import { useEffect, useState } from 'react'
import { SearchIcon, XIcon } from '@/components/ui/icons'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  delay?: number
}

export function SearchBar({ value, onChange, delay = 300 }: SearchBarProps) {
  const [text, setText] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      if (text !== value) {
        onChange(text)
      }
    }, delay)

    return () => clearTimeout(handler)
  }, [text, delay, onChange, value])

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground/80">
        Search
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-foreground/50">
          <SearchIcon className="h-4 w-4" />
        </span>
        <input
          type="search"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Search by name or email..."
          aria-label="Search students"
          className="glass-panel w-full rounded-md py-2.5 pl-10 pr-9 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-foreground/40"
        />
        {text && (
          <button
            type="button"
            onClick={() => {
              setText('')
              onChange('')
            }}
            aria-label="Clear search"
            className="absolute inset-y-0 right-2 flex cursor-pointer items-center rounded p-1 text-foreground/50 transition-colors hover:text-primary"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}