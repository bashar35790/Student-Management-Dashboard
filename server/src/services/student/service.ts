import type { Prisma } from '../../generated/prisma/client.js'
import { prisma } from '../../lib/prisma.js'
import { parsePagination } from '../../utils/pagination.js'
import type { ApiMeta } from '../../utils/response.js'
import type { CreateStudentInput, StudentQueryInput, UpdateStudentInput } from './schema.js'

const DEFAULT_ORDER: Prisma.StudentOrderByWithRelationInput = { createdAt: 'desc' }

function buildWhere(query: StudentQueryInput): Prisma.StudentWhereInput {
  const where: Prisma.StudentWhereInput = {}

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
    ]
  }

  if (query.status) {
    where.status = query.status
  }

  if (query.class) {
    where.class = { equals: query.class, mode: 'insensitive' }
  }

  return where
}

function buildOrder(sortBy: string | undefined, sortOrder: string | undefined): Prisma.StudentOrderByWithRelationInput {
  if (sortBy === 'name' || sortBy === 'createdAt' || sortBy === 'class') {
    return { [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc' }
  }
  return DEFAULT_ORDER
}

export interface ListStudentsResult {
  data: Awaited<ReturnType<typeof prisma.student.findMany>>
  meta: ApiMeta
}

export async function listStudents(query: StudentQueryInput): Promise<ListStudentsResult> {
  const where = buildWhere(query)
  const orderBy = buildOrder(query.sortBy, query.sortOrder)
  const pagination = parsePagination(query)

  const [data, total] = await Promise.all([
    prisma.student.findMany({
      where,
      orderBy,
      skip: pagination.skip,
      take: pagination.limit,
    }),
    prisma.student.count({ where }),
  ])

  return {
    data,
    meta: {
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    },
  }
}

export function getStudentById(id: string) {
  return prisma.student.findUnique({ where: { id } })
}

export function createStudent(data: CreateStudentInput) {
  return prisma.student.create({ data })
}

export function updateStudent(id: string, data: UpdateStudentInput) {
  return prisma.student.update({ where: { id }, data: data as Prisma.StudentUpdateInput })
}

export function deleteStudent(id: string) {
  return prisma.student.delete({ where: { id } })
}