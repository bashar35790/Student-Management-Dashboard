'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { BackLink } from '@/components/ui/BackLink'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CheckIcon, CopyIcon, PencilIcon, TrashIcon } from '@/components/ui/icons'
import { useDeleteStudentMutation, useGetStudentQuery } from '@/redux/services/studentApi'
import { getApiErrorMessage } from '@/lib/errors'

function CopyValue({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      title="Copy to clipboard"
      className="inline-flex cursor-pointer rounded p-1 text-foreground/40 transition-colors hover:text-primary"
    >
      {copied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
    </button>
  )
}

function DetailRow({
  label,
  value,
  copyable,
}: {
  label: string
  value: string
  copyable?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-sm text-foreground/50 uppercase tracking-wider">{label}</dt>
      <dd className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        <span className="text-right break-all">{value}</span>
        {copyable && <CopyValue value={value} label={label} />}
      </dd>
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

  useEffect(() => {
    if (!feedback) return
    const timer = setTimeout(() => setFeedback(null), 4000)
    return () => clearTimeout(timer)
  }, [feedback])

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
      <BackLink href="/">Back to students</BackLink>

      <div className="mt-4 rounded-xl glass-panel border-white/20 shadow-lg p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-2xl font-bold text-primary-foreground shadow-[0_4px_14px_0_rgba(255,45,95,0.39)]">
              {student.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{student.name}</h1>
              <div className="mt-2">
                <Badge tone={student.status === 'ACTIVE' ? 'success' : 'muted'}>{student.status}</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/students/${student.id}/edit`}
              className="inline-flex items-center gap-2 rounded-md glass px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-white/40 shadow-sm hover:shadow"
            >
              <PencilIcon className="h-4 w-4" />
              Edit
            </Link>
            <Button variant="dangerOutline" onClick={() => setConfirmOpen(true)}>
              <TrashIcon className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {feedback && (
          <div className="mt-6 animate-slide-up">
            <Alert variant="error" onDismiss={() => setFeedback(null)}>
              {feedback}
            </Alert>
          </div>
        )}

        <dl className="mt-8 flex flex-col divide-y divide-white/10 border-t border-white/10 pt-2">
          <DetailRow label="Email" value={student.email} copyable />
          <DetailRow label="Phone" value={student.phone} copyable />
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