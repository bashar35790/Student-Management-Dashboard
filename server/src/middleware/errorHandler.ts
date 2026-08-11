import type { ErrorRequestHandler } from 'express'
import { Prisma } from '../generated/prisma/client.js'
import { AppError } from '../utils/AppError.js'

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  let status = 500
  let message = 'Internal server error'
  let details: unknown

  if (error instanceof AppError) {
    status = error.status
    message = error.message
    details = error.details
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      status = 409
      message = 'Resource already exists with the same unique value'
    } else if (error.code === 'P2023') {
      status = 400
      message = 'Invalid resource id'
    } else if (error.code === 'P2025') {
      status = 404
      message = 'Resource not found'
    } else {
      status = 400
      message = 'Database request failed'
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    status = 400
    message = 'Invalid request data'
  }

  if (status >= 500) {
    console.error(error)
  }

  res.status(status).json({
    success: false,
    message,
    ...(details !== undefined && { details }),
  })
}