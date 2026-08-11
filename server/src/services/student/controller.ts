import type { NextFunction, Request, Response } from 'express'
import { Prisma } from '../../generated/prisma/client.js'
import { AppError } from '../../utils/AppError.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendData, sendPaginated, sendSuccess } from '../../utils/response.js'
import type { CreateStudentInput, StudentQueryInput, UpdateStudentInput } from './schema.js'
import {
  createStudent,
  deleteStudent,
  getStudentById,
  listStudents,
  updateStudent,
} from './service.js'

function isDuplicateEmail(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}

interface Params {
  id?: string
}

function studentIdFrom(req: Request): string {
  const id = (req.validatedParams as Params | undefined)?.id ?? (req.params as Params).id
  if (typeof id !== 'string' || id.length === 0) {
    throw new AppError(400, 'Invalid student id')
  }
  return id
}

export const listStudentsHandler = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validatedQuery as StudentQueryInput
  const result = await listStudents(query)
  sendPaginated(res, result.data, result.meta)
})

export const getStudentHandler = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const student = await getStudentById(studentIdFrom(req))
    if (!student) {
      throw new AppError(404, 'Student not found')
    }
    sendData(res, student, 'Student retrieved successfully')
  },
)

export const createStudentHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = req.validatedBody as CreateStudentInput
  try {
    const student = await createStudent(data)
    sendData(res, student, 'Student created successfully', 201)
  } catch (error) {
    if (isDuplicateEmail(error)) {
      throw new AppError(409, 'A student with this email already exists')
    }
    throw error
  }
})

export const updateStudentHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = req.validatedBody as UpdateStudentInput
  const id = studentIdFrom(req)

  const existing = await getStudentById(id)
  if (!existing) {
    throw new AppError(404, 'Student not found')
  }

  try {
    const student = await updateStudent(id, data)
    sendData(res, student, 'Student updated successfully')
  } catch (error) {
    if (isDuplicateEmail(error)) {
      throw new AppError(409, 'A student with this email already exists')
    }
    throw error
  }
})

export const deleteStudentHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = studentIdFrom(req)

  const existing = await getStudentById(id)
  if (!existing) {
    throw new AppError(404, 'Student not found')
  }

  await deleteStudent(id)
  sendSuccess(res, 'Student deleted successfully')
})