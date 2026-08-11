'use client'

import { useEffect, useState } from 'react'

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
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Search by name or email..."
        aria-label="Search students"
        className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
    </div>
  )
}