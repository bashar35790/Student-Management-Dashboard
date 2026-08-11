import type { Response } from 'express'

export interface ApiMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export function sendSuccess(res: Response, message: string, status = 200) {
  return res.status(status).json({ success: true, message })
}

export function sendData<T>(res: Response, data: T, message: string, status = 200) {
  return res.status(status).json({ success: true, message, data })
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  meta: ApiMeta,
  message = 'Request successful',
) {
  return res.status(200).json({ success: true, message, data, meta })
}