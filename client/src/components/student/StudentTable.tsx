import Link from 'next/link'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SortableHeader } from '@/components/student/SortableHeader'
import type { Student } from '@/types/student'

interface StudentTableProps {
  students: Student[]
  sortBy: 'name' | 'createdAt' | 'class'
  sortOrder: 'asc' | 'desc'
  onSort: (field: 'name' | 'createdAt' | 'class') => void
  onDelete: (student: Student) => void
}

const statusTone: Record<Student['status'], BadgeTone> = {
  ACTIVE: 'success',
  INACTIVE: 'muted',
}

function StatusBadge({ status }: { status: Student['status'] }) {
  return <Badge tone={statusTone[status]}>{status}</Badge>
}

function StudentAvatar({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase() || '?'
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
      {initial}
    </span>
  )
}

function FormatDate({ iso }: { iso: string }) {
  return (
    <time dateTime={iso} className="text-sm text-gray-600">
      {new Date(iso).toLocaleDateString()}
    </time>
  )
}

function Actions({ student, onDelete }: { student: Student; onDelete: (s: Student) => void }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/students/${student.id}/edit`}
        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        Edit
      </Link>
      <Button variant="dangerOutline" size="sm" onClick={() => onDelete(student)}>
        Delete
      </Button>
    </div>
  )
}

export function StudentTable({ students, sortBy, sortOrder, onSort, onDelete }: StudentTableProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-lg border border-gray-200 md:block">
        <table className="min-w-full divide-y divide-gray-200 text-left">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <SortableHeader label="Student" field="name" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} className="px-4 py-3" />
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <SortableHeader label="Class" field="class" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} className="px-4 py-3" />
              <th className="px-4 py-3 font-medium">Status</th>
              <SortableHeader label="Created" field="createdAt" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} className="px-4 py-3" />
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <StudentAvatar name={student.name} />
                    <Link href={`/students/${student.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                      {student.name}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{student.email}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{student.phone}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{student.class}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={student.status} />
                </td>
                <td className="px-4 py-3">
                  <FormatDate iso={student.createdAt} />
                </td>
                <td className="px-4 py-3">
                  <Actions student={student} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {students.map((student) => (
          <li key={student.id} className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <StudentAvatar name={student.name} />
                <div>
                  <Link href={`/students/${student.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                    {student.name}
                  </Link>
                  <p className="text-sm text-gray-600">{student.email}</p>
                </div>
              </div>
              <StatusBadge status={student.status} />
            </div>
            <div className="text-sm text-gray-600">
              <p>Phone: {student.phone}</p>
              <p>Class: {student.class}</p>
              <p>
                Created: <FormatDate iso={student.createdAt} />
              </p>
            </div>
            <Actions student={student} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </>
  )
}