const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 100

export interface Pagination {
  page: number
  limit: number
  skip: number
}

function toPositiveInt(value: unknown, fallback: number): number {
  const parsed = Number.parseInt(String(value), 10)
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed
}

export function parsePagination(query: Record<string, unknown>): Pagination {
  const page = toPositiveInt(query.page, DEFAULT_PAGE)
  const limit = Math.min(MAX_LIMIT, toPositiveInt(query.limit, DEFAULT_LIMIT))
  return { page, limit, skip: (page - 1) * limit }
}