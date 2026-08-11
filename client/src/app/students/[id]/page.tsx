'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useDeleteStudentMutation, useGetStudentQuery } from '@/redux/services/studentApi'
import { getApiErrorMessage } from '@/lib/errors'

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-sm font-medium text-gray-900">{value}</dd>
    </div>
  )
}

export default function StudentDetailsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const { data: student, isLoading, isError, refetch } = useGetStudentQuery(params.id)
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation()

  const handleDelete = async () => {
    if (!student) return
    try {
      await deleteStudent(student.id).unwrap()
      router.push('/')
    } catch (error) {
      setFeedback(getApiErrorMessage(error, 'Failed to delete student.'))
      setConfirmOpen(false)
    }
  }

  if (isLoading) return <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8"><LoadingState /></main>

  if (isError || !student) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <ErrorState onRetry={refetch} message="Unable to load this student. Please try again." />
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
        &larr; Back to students
      </Link>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-700">
              {student.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{student.name}</h1>
              <div className="mt-1">
                <Badge tone={student.status === 'ACTIVE' ? 'success' : 'muted'}>{student.status}</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/students/${student.id}/edit`}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Edit
            </Link>
            <Button variant="dangerOutline" onClick={() => setConfirmOpen(true)}>
              Delete
            </Button>
          </div>
        </div>

        {feedback && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{feedback}</p>}

        <dl className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-6">
          <DetailRow label="Email" value={student.email} />
          <DetailRow label="Phone" value={student.phone} />
          <DetailRow label="Class" value={student.class} />
          <DetailRow label="Created" value={new Date(student.createdAt).toLocaleString()} />
          <DetailRow label="Last updated" value={new Date(student.updatedAt).toLocaleString()} />
        </dl>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete student"
        message={`Are you sure you want to delete ${student.name}? This action cannot be undone.`}
        busy={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </main>
  )
}