import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFoundHandler } from './middleware/notFound.js'
import studentRoutes from './routes/student.routes.js'

const app = express()

app.use(cors({ origin: env.CLIENT_URL, credentials: true }))
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ success: true, message: 'Student Management API' })
})

app.get('/api/v1/health', (_req, res) => {
  res.json({ success: true, message: 'OK' })
})

app.use('/api/v1/students', studentRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app