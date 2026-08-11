export const STUDENT_STATUSES = ['ACTIVE', 'INACTIVE'] as const

export type StudentStatus = (typeof STUDENT_STATUSES)[number]

export interface Student {
  id: string
  name: string
  email: string
  phone: string
  class: string
  status: StudentStatus
  createdAt: string
  updatedAt: string
}

export type StudentInput = {
  name: string
  email: string
  phone: string
  class: string
  status: StudentStatus
}

export type UpdateStudentInput = Partial<StudentInput>

export const SORTABLE_FIELDS = ['name', 'createdAt', 'class'] as const

export interface StudentQuery {
  search?: string
  status?: StudentStatus
  class?: string
  page?: number
  limit?: number
  sortBy?: (typeof SORTABLE_FIELDS)[number]
  sortOrder?: 'asc' | 'desc'
}

export interface ApiMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
  meta?: ApiMeta
}

export interface PaginatedResult<T> {
  data: T[]
  meta: ApiMeta
}