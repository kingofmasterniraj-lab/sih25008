import { Router } from 'express'
import db from '../db.js'

const router = Router()

router.get('/', (req, res) => {
  const rows = db.get().prepare('SELECT * FROM modules').all()
  res.json(rows)
})

router.get('/:id', (req, res) => {
  const id = Number(req.params.id)
  const mod = db.get().prepare('SELECT * FROM modules WHERE id = ?').get(id)
  if (!mod) return res.status(404).json({ error: 'Module not found' })
  const questions = db.get().prepare('SELECT * FROM quiz_questions WHERE module_id = ?').all(id)
  res.json({ ...mod, questions: questions.map(q => ({
    id: q.id,
    question: q.question,
    options: JSON.parse(q.options)
  })) })
})

export default router
