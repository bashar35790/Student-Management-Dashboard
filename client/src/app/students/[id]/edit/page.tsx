'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { StudentForm, type StudentFormValues } from '@/components/student/StudentForm'
import { BackLink } from '@/components/ui/BackLink'
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
        <LoadingState variant="card" />
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
      <BackLink href={`/students/${student.id}`}>Back to student</BackLink>
      <div className="mt-4 mb-6">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Edit Student</h1>
        <p className="text-sm text-foreground/60 mt-1">Update the details for {student.name}.</p>
      </div>

      <StudentForm
        initialValues={student}
        submitLabel="Save Changes"
        isSubmitting={isUpdating}
        cancelHref={`/students/${student.id}`}
        serverError={serverError}
        onSubmit={handleSubmit}
      />
    </main>
  )
}