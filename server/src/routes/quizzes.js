import { Router } from 'express'
import db from '../db.js'

const router = Router()

router.post('/submit', (req, res) => {
  const { moduleId, answers = [], role = 'Student' } = req.body
  const qs = db.get().prepare('SELECT id, correct_index FROM quiz_questions WHERE module_id = ?').all(moduleId)
  let score = 0
  qs.forEach((q, idx) => {
    if (answers[idx] === q.correct_index) score += 1
  })
  // very simple gamification badges
  const badge = score === qs.length ? 'Gold' : (score >= Math.ceil(qs.length * 0.6) ? 'Silver' : 'Bronze')
  res.json({ score, total: qs.length, badge, role })
})

export default router
