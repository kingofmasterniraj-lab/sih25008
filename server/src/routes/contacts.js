import { Router } from 'express'
import db from '../db.js'

const router = Router()

router.get('/', (req, res) => {
  const { region } = req.query
  if (region) {
    const rows = db.get().prepare('SELECT * FROM contacts WHERE region = ?').all(region)
    return res.json(rows)
  }
  const rows = db.get().prepare('SELECT * FROM contacts').all()
  res.json(rows)
})

export default router
