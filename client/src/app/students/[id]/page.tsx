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
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between py-2">
      <dt className="text-sm text-foreground/50 uppercase tracking-wider">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
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
      <Link href="/" className="text-sm text-foreground/70 hover:text-primary transition-colors">
        &larr; Back to students
      </Link>

      <div className="mt-4 rounded-xl glass-panel border-white/20 shadow-lg p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-5">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-2xl font-bold text-primary shadow-inner border border-primary/20">
              {student.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{student.name}</h1>
              <div className="mt-2">
                <Badge tone={student.status === 'ACTIVE' ? 'success' : 'muted'}>{student.status}</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/students/${student.id}/edit`}
              className="inline-flex items-center rounded-md glass px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-white/40 shadow-sm hover:shadow"
            >
              Edit
            </Link>
            <Button variant="dangerOutline" onClick={() => setConfirmOpen(true)}>
              Delete
            </Button>
          </div>
        </div>

        {feedback && <p className="mt-6 rounded-md bg-red-50/50 glass px-4 py-3 text-sm text-red-700">{feedback}</p>}

        <dl className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6">
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