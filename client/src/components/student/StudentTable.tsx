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
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary shadow-inner border border-primary/20">
      {initial}
    </span>
  )
}

function FormatDate({ iso }: { iso: string }) {
  return (
    <time dateTime={iso} className="text-sm text-foreground/70">
      {new Date(iso).toLocaleDateString()}
    </time>
  )
}

function Actions({ student, onDelete }: { student: Student; onDelete: (s: Student) => void }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/students/${student.id}/edit`}
        className="inline-flex items-center rounded-md border border-gray-300 bg-white/50 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-white/80 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-700/80"
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
      <div className="hidden overflow-hidden rounded-xl glass-panel md:block border-white/20 shadow-lg">
        <table className="min-w-full divide-y divide-gray-200/50 text-left">
          <thead className="glass text-xs uppercase tracking-wide text-foreground/60">
            <tr>
              <SortableHeader label="Student" field="name" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} className="px-4 py-4" />
              <th className="px-4 py-4 font-semibold">Email</th>
              <th className="px-4 py-4 font-semibold">Phone</th>
              <SortableHeader label="Class" field="class" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} className="px-4 py-4" />
              <th className="px-4 py-4 font-semibold">Status</th>
              <SortableHeader label="Created" field="createdAt" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} className="px-4 py-4" />
              <th className="px-4 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/20 glass-panel">
            {students.map((student) => (
              <tr key={student.id} className="transition-colors hover:bg-white/40 dark:hover:bg-white/5">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <StudentAvatar name={student.name} />
                    <Link href={`/students/${student.id}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                      {student.name}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-foreground/80">{student.email}</td>
                <td className="px-4 py-3 text-sm text-foreground/80">{student.phone}</td>
                <td className="px-4 py-3 text-sm text-foreground/80 font-medium">{student.class}</td>
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

      <ul className="flex flex-col gap-4 md:hidden">
        {students.map((student) => (
          <li key={student.id} className="flex flex-col gap-4 rounded-xl glass-panel p-5 border-white/20 shadow-md transition-all hover:shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <StudentAvatar name={student.name} />
                <div>
                  <Link href={`/students/${student.id}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                    {student.name}
                  </Link>
                  <p className="text-sm text-foreground/70">{student.email}</p>
                </div>
              </div>
              <StatusBadge status={student.status} />
            </div>
            <div className="text-sm text-foreground/80 grid grid-cols-2 gap-2 bg-white/5 p-3 rounded-lg border border-white/10">
              <p><span className="text-foreground/50 text-xs uppercase tracking-wider block">Phone</span> {student.phone}</p>
              <p><span className="text-foreground/50 text-xs uppercase tracking-wider block">Class</span> <span className="font-medium">{student.class}</span></p>
              <p className="col-span-2"><span className="text-foreground/50 text-xs uppercase tracking-wider block">Created</span> <FormatDate iso={student.createdAt} /></p>
            </div>
            <Actions student={student} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </>
  )
}