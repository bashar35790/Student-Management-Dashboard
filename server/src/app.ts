import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFoundHandler } from './middleware/notFound.js'

const app = express()

app.use(cors({ origin: env.CLIENT_URL, credentials: true }))
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ success: true, message: 'Student Management API' })
})

app.use(notFoundHandler)
app.use(errorHandler)

export default app