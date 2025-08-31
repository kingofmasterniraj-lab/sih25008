import { Router } from 'express'
import db from '../db.js'

const router = Router()

router.get('/', (req, res) => {
  const rows = db.get().prepare('SELECT * FROM alerts ORDER BY datetime(created_at) DESC LIMIT 100').all()
  res.json(rows)
})

router.post('/', (req, res) => {
  const { title, message, region } = req.body
  if (!title || !message || !region) return res.status(400).json({ error: 'title, message, region required' })
  const result = db.get().prepare('INSERT INTO alerts (title, message, region) VALUES (?, ?, ?)').run(title, message, region)
  const alert = db.get().prepare('SELECT * FROM alerts WHERE id = ?').get(result.lastInsertRowid)
  // broadcast via Socket.IO
  const io = req.app.get('io')
  io.emit('alert:new', alert)
  res.json(alert)
})

export default router
