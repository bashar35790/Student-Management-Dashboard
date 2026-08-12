'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { StudentForm, type StudentFormValues } from '@/components/student/StudentForm'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { useGetStudentQuery, useUpdateStudentMutation } from '@/redux/services/studentApi'
import { getApiErrorMessage } from '@/lib/errors'

export default function EditStudentPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const { data: student, isLoading, isError, refetch } = useGetStudentQuery(params.id)
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation()

  const handleSubmit = async (values: StudentFormValues) => {
    setServerError(null)
    try {
      await updateStudent({ id: params.id, body: values }).unwrap()
      router.push(`/students/${params.id}`)
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Failed to update student.'))
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <LoadingState />
      </main>
    )
  }

  if (isError || !student) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <ErrorState onRetry={refetch} message="Unable to load this student. Please try again." />
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <Link href={`/students/${student.id}`} className="text-sm text-foreground/70 hover:text-primary transition-colors">
        &larr; Back to student
      </Link>
      <h1 className="mt-3 mb-6 text-3xl font-bold text-foreground tracking-tight">Edit Student</h1>

      <div>
        <StudentForm
          initialValues={student}
          submitLabel="Save Changes"
          isSubmitting={isUpdating}
          serverError={serverError}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  )
}