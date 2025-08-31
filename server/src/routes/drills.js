import { Router } from 'express'
import db from '../db.js'

const router = Router()

router.get('/', (req, res) => {
  const rows = db.get().prepare('SELECT * FROM drills ORDER BY datetime(scheduled_at) ASC').all()
  // parse steps
  const parsed = rows.map(r => ({ ...r, steps: JSON.parse(r.steps) }))
  res.json(parsed)
})

router.post('/:id/participate', (req, res) => {
  const id = Number(req.params.id)
  const { role = 'Student', completed = 0 } = req.body || {}
  const drill = db.get().prepare('SELECT * FROM drills WHERE id = ?').get(id)
  if (!drill) return res.status(404).json({ error: 'Drill not found' })
  db.get().prepare('INSERT INTO drill_participation (drill_id, participant_role, completed) VALUES (?, ?, ?)').run(id, role, completed ? 1 : 0)
  res.json({ ok: true })
})

export default router
