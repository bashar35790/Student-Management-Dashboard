'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StudentForm, type StudentFormValues } from '@/components/student/StudentForm'
import { BackLink } from '@/components/ui/BackLink'
import { useCreateStudentMutation } from '@/redux/services/studentApi'
import { getApiErrorMessage } from '@/lib/errors'

export default function NewStudentPage() {
  const router = useRouter()
  const [createStudent, { isLoading }] = useCreateStudentMutation()
  const [serverError, setServerError] = useState<string | null>(null)

  const handleSubmit = async (values: StudentFormValues) => {
    setServerError(null)
    try {
      await createStudent(values).unwrap()
      router.push('/')
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Failed to create student.'))
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <BackLink href="/">Back to students</BackLink>
      <div className="mt-4 mb-6">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Add Student</h1>
        <p className="text-sm text-foreground/60 mt-1">
          Create a new student record. Fields marked are required.
        </p>
      </div>

      <StudentForm
        submitLabel="Create Student"
        isSubmitting={isLoading}
        cancelHref="/"
        serverError={serverError}
        onSubmit={handleSubmit}
      />
    </main>
  )
}