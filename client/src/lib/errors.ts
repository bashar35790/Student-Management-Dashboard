export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error && typeof error === 'object') {
    const record = error as { data?: { message?: string }; message?: string }
    if (typeof record.data?.message === 'string' && record.data.message) {
      return record.data.message
    }
    if (typeof record.message === 'string' && record.message) {
      return record.message
    }
  }
  return fallback
}