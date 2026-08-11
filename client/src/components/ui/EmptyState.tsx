interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message = 'No students found.' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
      <p className="text-sm font-medium text-gray-700">{message}</p>
      <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
    </div>
  )
}