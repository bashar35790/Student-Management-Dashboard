'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { STUDENT_STATUSES, type StudentStatus } from '@/types/student'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

const studentFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z.string().trim().min(1, 'Phone is required'),
  class: z.string().trim().min(1, 'Class is required'),
  status: z.enum(STUDENT_STATUSES, {
    errorMap: () => ({ message: 'Status is required' }),
  }),
})

export type StudentFormValues = z.infer<typeof studentFormSchema>

const statusOptions = [
  { value: '', label: 'Select status' },
  ...STUDENT_STATUSES.map((status) => ({
    value: status,
    label: status === 'ACTIVE' ? 'Active' : 'Inactive',
  })),
]

interface StudentFormProps {
  initialValues?: StudentFormValues
  isSubmitting?: boolean
  submitLabel?: string
  serverError?: string | null
  onSubmit: (values: StudentFormValues) => Promise<void> | void
}

export function StudentForm({
  initialValues,
  isSubmitting = false,
  submitLabel = 'Save',
  serverError,
  onSubmit,
}: StudentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: initialValues ?? { status: '' as StudentStatus },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      {serverError && <Alert variant="error">{serverError}</Alert>}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Name" placeholder="Student full name" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" placeholder="student@example.com" error={errors.email?.message} {...register('email')} />

        <Input label="Phone" placeholder="+1 555-0000" error={errors.phone?.message} {...register('phone')} />
        <Input label="Class" placeholder="Grade 9A" error={errors.class?.message} {...register('class')} />

        <Select label="Status" options={statusOptions} error={errors.status?.message} {...register('status')} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}