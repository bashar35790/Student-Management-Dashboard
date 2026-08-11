import { z } from 'zod'

export const STATUS_VALUES = ['ACTIVE', 'INACTIVE'] as const

export const studentStatusSchema = z.enum(STATUS_VALUES)

export const createStudentSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.email('Please enter a valid email address'),
  phone: z.string().trim().min(1, 'Phone is required'),
  class: z.string().trim().min(1, 'Class is required'),
  status: studentStatusSchema,
})

export const updateStudentSchema = createStudentSchema.partial()

export const SORTABLE_FIELDS = ['name', 'createdAt', 'class'] as const

export const studentQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: studentStatusSchema.optional(),
  class: z.string().trim().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  sortBy: z.enum(SORTABLE_FIELDS).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

export type StudentStatus = z.infer<typeof studentStatusSchema>
export type CreateStudentInput = z.infer<typeof createStudentSchema>
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>
export type StudentQueryInput = z.output<typeof studentQuerySchema>