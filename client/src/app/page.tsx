'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ClassFilter } from '@/components/student/ClassFilter'
import { SearchBar } from '@/components/student/SearchBar'
import { StatusFilter } from '@/components/student/StatusFilter'
import { StudentTable } from '@/components/student/StudentTable'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { Pagination } from '@/components/ui/Pagination'
import { PlusIcon, XIcon } from '@/components/ui/icons'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  setClassFilter,
  setPage,
  setSearch,
  setSort,
  setStatus,
} from '@/redux/features/studentListSlice'
import { useDeleteStudentMutation, useGetStudentsQuery } from '@/redux/services/studentApi'
import { getApiErrorMessage } from '@/lib/errors'
import type { Student } from '@/types/student'

type Feedback = { type: 'success' | 'error'; message: string } | null

const FEEDBACK_DURATION = 4000

export default function StudentsPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { search, status, class: classFilter, page, sortBy, sortOrder } = useAppSelector(
    (state) => state.studentList,
  )

  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
  const [feedback, setFeedback] = useState<Feedback>(null)

  const { data, isLoading, isError, refetch } = useGetStudentsQuery({
    search,
    status: status || undefined,
    class: classFilter || undefined,
    page,
    limit: 10,
    sortBy,
    sortOrder,
  })

  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation()

  const classOptions = useMemo(() => {
    const classes = new Set(data?.data.map((student) => student.class) ?? [])
    return [...classes].sort()
  }, [data])

  const hasFilters = search.trim() !== '' || status !== '' || classFilter !== ''

  useEffect(() => {
    if (!feedback) return
    const timer = setTimeout(() => setFeedback(null), FEEDBACK_DURATION)
    return () => clearTimeout(timer)
  }, [feedback])

  const handleSort = (field: 'name' | 'createdAt' | 'class') => {
    const nextOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc'
    dispatch(setSort({ sortBy: field, sortOrder: nextOrder }))
  }

  const clearFilters = () => {
    dispatch(setSearch(''))
    dispatch(setStatus(''))
    dispatch(setClassFilter(''))
  }

  const handleDelete = async () => {
    if (!studentToDelete) return
    try {
      await deleteStudent(studentToDelete.id).unwrap()
      setFeedback({ type: 'success', message: `${studentToDelete.name} was deleted.` })
    } catch (error) {
      setFeedback({ type: 'error', message: getApiErrorMessage(error, 'Failed to delete student.') })
    }
    setStudentToDelete(null)
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-foreground tracking-tight">
            Students
            {data && data.meta.total > 0 && (
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-sm font-semibold text-primary">
                {data.meta.total}
              </span>
            )}
          </h1>
          <p className="text-sm text-foreground/60 mt-1">
            View, search, filter and manage student records.
          </p>
        </div>
        <Link
          href="/students/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-hover shadow-[0_4px_14px_0_rgba(255,45,95,0.39)] hover:shadow-[0_6px_20px_rgba(255,45,95,0.23)] hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <PlusIcon className="h-4 w-4" />
          Add Student
        </Link>
      </div>

      {feedback && (
        <div className="mb-4 animate-slide-up">
          <Alert variant={feedback.type} onDismiss={() => setFeedback(null)}>
            {feedback.message}
          </Alert>
        </div>
      )}

      <section className="mb-6 rounded-xl glass-panel border-white/20 p-4 shadow-lg sm:p-5">
        {hasFilters && (
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm text-foreground/60">
              Filters are active
              <span className="mx-2 text-foreground/30" aria-hidden="true">·</span>
              <span className="font-medium text-foreground">
                {data?.meta.total ?? 0} match{data?.meta.total === 1 ? '' : 'es'}
              </span>
            </p>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <XIcon className="h-4 w-4" />
              Clear all
            </Button>
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-3">
          <SearchBar value={search} onChange={(value) => dispatch(setSearch(value))} />
          <StatusFilter value={status} onChange={(value) => dispatch(setStatus(value))} />
          <ClassFilter
            value={classFilter}
            onChange={(value) => dispatch(setClassFilter(value))}
            classes={classOptions}
          />
        </div>
      </section>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : data && data.data.length === 0 ? (
        hasFilters ? (
          <EmptyState
            message="No students match your filters"
            description="Try changing or clearing your search and filters to see more results."
            actionLabel="Clear all filters"
            onAction={clearFilters}
          />
        ) : (
          <EmptyState
            message="No students yet"
            description="Add your first student to get started."
            actionLabel="Add a student"
            onAction={() => router.push('/students/new')}
          />
        )
      ) : data ? (
        <>
          <StudentTable
            students={data.data}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onDelete={setStudentToDelete}
          />
          <div className="mt-4">
            <Pagination
              page={page}
              totalPages={data.meta.totalPages}
              total={data.meta.total}
              onPageChange={(nextPage) => dispatch(setPage(nextPage))}
            />
          </div>
        </>
      ) : null}

      <ConfirmDialog
        open={studentToDelete !== null}
        title="Delete student"
        message={`Are you sure you want to delete ${studentToDelete?.name ?? 'this student'}? This action cannot be undone.`}
        busy={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setStudentToDelete(null)}
      />
    </main>
  )
}