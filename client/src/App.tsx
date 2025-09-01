import { useEffect, useState, useRef } from 'react'
import { useApp } from './store'
import { io } from 'socket.io-client'
import { api } from './api'
import Home from './components/Home'
import Learn from './components/Learn'
import Drills from './components/Drills'
import Directory from './components/Directory'
import Dashboard from './components/Dashboard'
import AddDrill from './pages/AddDrill' // new AddDrill page

type Tab = 'Home' | 'Learn' | 'Drills' | 'Directory' | 'Dashboard' | 'AddDrill'

export default function App() {
  const [tab, setTab] = useState<Tab>('Home')
  const { role, setRole } = useApp()
  const [incoming, setIncoming] = useState<any | null>(null)

  // Ref for alert sound
  const alertAudio = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // load alert sound
    alertAudio.current = new Audio('/alert.mp3')

    const socket = io()
    socket.on('alert:new', (data) => {
      setIncoming(data)
      // play sound when alert comes
      alertAudio.current?.play().catch(() => {
        console.log('Auto-play blocked by browser')
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const tabs: Tab[] = ['Home', 'Learn', 'Drills', 'Directory', 'Dashboard', 'AddDrill']

  return (
    <div className="min-h-full">
      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold">SIH25008</span>
            <span className="hidden sm:block text-sm text-gray-500">
              Disaster Prep & Response Education
            </span>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="border rounded-xl px-3 py-2"
              value={role}
              aria-label="Select role"
              onChange={(e) => setRole(e.target.value as any)}
            >
              <option>Student</option>
              <option>Teacher</option>
              <option>Admin</option>
            </select>
          </div>
        </div>
      </header>

      {/* ALERT BAR */}
      {incoming && (
        <div className="container mt-3">
          <div className="card border-l-4 border-l-red-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">New Alert: {incoming.title}</div>
                <div className="text-sm text-gray-600">
                  {incoming.message} — <span className="badge">{incoming.region}</span>
                </div>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setIncoming(null)
                  // stop audio if playing
                  if (alertAudio.current) {
                    alertAudio.current.pause()
                    alertAudio.current.currentTime = 0
                  }
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <nav className="container mt-4">
        <div className="grid grid-cols-6 gap-2">
          {tabs.map((name) => {
            if (name === 'AddDrill' && role === 'Student') return null
            return (
              <button
                key={name}
                className={'btn ' + (tab === name ? 'btn-primary' : 'btn-secondary')}
                onClick={() => setTab(name)}
              >
                {name === 'AddDrill' ? 'Add Drill' : name}
              </button>
            )
          })}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="container my-4 grid gap-4">
        {tab === 'Home' && <Home />}
        {tab === 'Learn' && <Learn />}
        {tab === 'Drills' && <Drills />}
        {tab === 'Directory' && <Directory />}
        {tab === 'Dashboard' && <Dashboard />}
        {tab === 'AddDrill' && <AddDrill />}
      </main>

      {/* FOOTER */}
      <footer className="container py-6 text-center text-sm text-gray-500">
        Built for education — extend freely.
      </footer>
    </div>
  )
}

