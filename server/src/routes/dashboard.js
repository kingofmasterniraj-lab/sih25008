import { Router } from 'express'
import db from '../db.js'

const router = Router()

router.get('/summary', (req, res) => {
  const totalAlerts = db.get().prepare('SELECT COUNT(*) as c FROM alerts').get().c
  const totalDrills = db.get().prepare('SELECT COUNT(*) as c FROM drills').get().c
  const participation = db.get().prepare('SELECT COUNT(*) as c, SUM(completed) as completed FROM drill_participation').get()
  const avgCompletion = participation.c ? Math.round((participation.completed || 0) * 100 / participation.c) : 0

  // simple preparedness score heuristic
  const moduleCount = db.get().prepare('SELECT COUNT(*) as c FROM modules').get().c
  const score = Math.min(100, 40 + moduleCount * 10 + Math.min(30, avgCompletion))

  res.json({
    totalAlerts,
    totalDrills,
    participationCount: participation.c,
    avgCompletion,
    preparednessScore: score
  })
})

export default router
