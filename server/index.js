import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import db from './src/db.js'
import modulesRouter from './src/routes/modules.js'
import quizzesRouter from './src/routes/quizzes.js'
import drillsRouter from './src/routes/drills.js'
import alertsRouter from './src/routes/alerts.js'
import contactsRouter from './src/routes/contacts.js'
import dashboardRouter from './src/routes/dashboard.js'

const app = express()
const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, { cors: { origin: '*' } })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json({ limit: '1mb' }))

// Attach io to app for routers to emit events
app.set('io', io)

// API routes
app.use('/api/modules', modulesRouter)
app.use('/api/quizzes', quizzesRouter)
app.use('/api/drills', drillsRouter)
app.use('/api/alerts', alertsRouter)
app.use('/api/contacts', contactsRouter)
app.use('/api/dashboard', dashboardRouter)

// Serve static client in production
const publicDir = path.join(__dirname, 'public')
app.use(express.static(publicDir))
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'))
})

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id)
  socket.on('disconnect', () => console.log('Socket disconnected:', socket.id))
})

httpServer.listen(PORT, () => {
  db.init()
  console.log(`Server running on http://localhost:${PORT}`)
})
