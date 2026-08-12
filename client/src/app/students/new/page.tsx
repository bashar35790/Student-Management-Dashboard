'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { StudentForm, type StudentFormValues } from '@/components/student/StudentForm'
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
      <Link href="/" className="text-sm text-foreground/70 hover:text-primary transition-colors">
        &larr; Back to students
      </Link>
      <h1 className="mt-3 mb-6 text-3xl font-bold text-foreground tracking-tight">Add Student</h1>

      <div>
        <StudentForm
          submitLabel="Create Student"
          isSubmitting={isLoading}
          serverError={serverError}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  )
}