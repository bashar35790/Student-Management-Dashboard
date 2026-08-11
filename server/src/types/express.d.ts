declare global {
  namespace Express {
    interface Request {
      validatedBody?: unknown
      validatedQuery?: Record<string, unknown>
      validatedParams?: Record<string, unknown>
    }
  }
}

export {}