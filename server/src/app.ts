import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'

const app = express()

app.use(cors({ origin: env.CLIENT_URL, credentials: true }))
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ success: true, message: 'Student Management API' })
})

export default app