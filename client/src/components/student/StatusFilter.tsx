'use client'

import type { StudentStatus } from '@/types/student'
import { Select, type SelectOption } from '@/components/ui/Select'

export type StatusFilterValue = '' | StudentStatus

interface StatusFilterProps {
  value: StatusFilterValue
  onChange: (value: StatusFilterValue) => void
}

const statusOptions: SelectOption[] = [
  { value: '', label: 'All statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
]

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <Select
      label="Status"
      name="filter-status"
      options={statusOptions}
      value={value}
      onChange={(event) => onChange(event.target.value as StatusFilterValue)}
      className="w-full"
    />
  )
}