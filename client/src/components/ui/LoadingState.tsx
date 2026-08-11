import { Spinner } from './Spinner'

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Loading students...' }: LoadingStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-6 py-16 text-center"
      role="status"
    >
      <Spinner className="h-6 w-6 text-blue-600" />
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  )
}