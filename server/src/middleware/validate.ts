import type { Schema } from 'zod'
import type { NextFunction, Request, RequestHandler, Response } from 'express'
import { AppError } from '../utils/AppError.js'

interface ValidateTargets {
  body?: Schema
  query?: Schema
  params?: Schema
}

export function validate(targets: ValidateTargets): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (targets.body) req.validatedBody = targets.body.parse(req.body)
      if (targets.query) req.validatedQuery = targets.query.parse(req.query) as Record<string, unknown>
      if (targets.params) req.validatedParams = targets.params.parse(req.params) as Record<string, unknown>
      next()
    } catch (error) {
      next(new AppError(400, 'Invalid request data', formatIssues(error)))
    }
  }
}

function formatIssues(error: unknown) {
  if (typeof error !== 'object' || error === null || !('issues' in error)) {
    return undefined
  }

  const issues = (error as { issues: { path: (string | number)[]; message: string }[] }).issues
  return issues.reduce<Record<string, string[]>>((acc, issue) => {
    const key = issue.path.join('.')
    ;(acc[key] ??= []).push(issue.message)
    return acc
  }, {})
}