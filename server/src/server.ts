import app from './app.js'
import { env } from './config/env.js'

const server = app.listen(env.PORT, () => {
  console.log(`Student Management API listening on http://localhost:${env.PORT}`)
})

function shutdown(signal: string) {
  console.log(`\n${signal} received, shutting down gracefully...`)
  server.close(() => process.exit(0))
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))