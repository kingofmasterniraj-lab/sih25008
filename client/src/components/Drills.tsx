import { useEffect, useState } from 'react'
import { api } from '../api'

function Timer({ seconds, onDone }: { seconds: number, onDone: () => void }) {
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    const id = setInterval(() => setLeft(l => {
      if (l <= 1) { clearInterval(id); onDone(); return 0 }
      return l - 1
    }), 1000)
    return () => clearInterval(id)
  }, [onDone])
  return <div className='text-xl font-bold'>{left}s</div>
}

export default function Drills() {
  const [drills, setDrills] = useState<any[]>([])
  const [active, setActive] = useState<any | null>(null)
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const role = localStorage.getItem('role') || 'Student'

  useEffect(() => {
    api.get('/drills').then(r => setDrills(r.data))
  }, [])

  const playAlertSound = () => {
    const audio = new Audio('/alert.mp3')
    audio.play().catch(() => {})
  }

  const start = (d: any) => {
    setActive(d)
    setStep(0)
    setDone(false)
    playAlertSound()   // 🔊 play siren when drill starts
  }

  const next = () => setStep(s => s + 1)
  const finish = async () => {
    setDone(true)
    await api.post(`/drills/${active.id}/participate`, { role, completed: 1 })
  }

  return (
    <div className='grid gap-4'>
      <div className='card'>
        <div className='font-semibold mb-2'>Upcoming Drills</div>
        <div className='grid gap-2'>
          {drills.map(d => (
            <div key={d.id} className='p-3 border rounded-xl bg-blue-50'>
              <div className='font-semibold'>
                {d.title} <span className='badge'>{d.hazard}</span>
              </div>
              <div className='text-sm text-gray-600'>
                Scheduled: {new Date(d.scheduled_at).toLocaleString()}
              </div>
              <button className='btn btn-primary mt-2' onClick={() => start(d)}>
                Run Virtual Drill
              </button>
            </div>
          ))}
        </div>
      </div>

      {active && (
        <div className='card'>
          <div className='font-semibold'>{active.title}</div>
          {step < active.steps.length ? (
            <div className='mt-2'>
              <div className='text-sm text-gray-600'>
                Step {step + 1}/{active.steps.length}
              </div>
              <div className='text-lg font-semibold'>
                {active.steps[step].label}
              </div>
              <div className='mt-2'>
                <Timer seconds={active.steps[step].seconds} onDone={next} />
              </div>
            </div>
          ) : (
            <div className='mt-2'>
              {!done ? (
                <button className='btn btn-primary' onClick={finish}>
                  Mark Drill Completed
                </button>
              ) : (
                <div className='p-3 border rounded-xl bg-green-50'>
                  Drill completed. Great job!
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
