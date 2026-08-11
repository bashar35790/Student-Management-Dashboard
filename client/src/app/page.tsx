'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ClassFilter } from '@/components/student/ClassFilter'
import { SearchBar } from '@/components/student/SearchBar'
import { StatusFilter } from '@/components/student/StatusFilter'
import { StudentTable } from '@/components/student/StudentTable'
import { Alert } from '@/components/ui/Alert'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { Pagination } from '@/components/ui/Pagination'
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

export default function StudentsPage() {
  const dispatch = useAppDispatch()
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

  const handleSort = (field: 'name' | 'createdAt' | 'class') => {
    const nextOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc'
    dispatch(setSort({ sortBy: field, sortOrder: nextOrder }))
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
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-600">View, search, filter and manage student records.</p>
        </div>
        <Link
          href="/students/new"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Add Student
        </Link>
      </div>

      {feedback && (
        <div className="mb-4">
          <Alert variant={feedback.type}>{feedback.message}</Alert>
        </div>
      )}

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <SearchBar value={search} onChange={(value) => dispatch(setSearch(value))} />
        <StatusFilter value={status} onChange={(value) => dispatch(setStatus(value))} />
        <ClassFilter
          value={classFilter}
          onChange={(value) => dispatch(setClassFilter(value))}
          classes={classOptions}
        />
      </div>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : data && data.data.length === 0 ? (
        <EmptyState />
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