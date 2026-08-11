'use client'

import { Select, type SelectOption } from '@/components/ui/Select'

interface ClassFilterProps {
  value: string
  onChange: (value: string) => void
  classes: string[]
}

export function ClassFilter({ value, onChange, classes }: ClassFilterProps) {
  const options: SelectOption[] = [
    { value: '', label: 'All classes' },
    ...classes.map((className) => ({ value: className, label: className })),
  ]

  return (
    <Select
      label="Class"
      name="filter-class"
      options={options}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full"
    />
  )
}