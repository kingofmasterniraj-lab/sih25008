import { useEffect, useState } from 'react'
import { useApp } from './store'
import { io } from 'socket.io-client'
import { api } from './api'
import Home from './components/Home'
import Learn from './components/Learn'
import Drills from './components/Drills'
import Directory from './components/Directory'
import Dashboard from './components/Dashboard'

type Tab = 'Home' | 'Learn' | 'Drills' | 'Directory' | 'Dashboard'

export default function App() {
  const [tab, setTab] = useState<Tab>('Home')
  const { role, setRole } = useApp()
  const [incoming, setIncoming] = useState<any | null>(null)

  useEffect(() => {
    const socket = io()
    socket.on('alert:new', (data) => setIncoming(data))
    return () => { socket.disconnect() }
  }, [])

  return (
    <div className='min-h-full'>
      <header className='bg-white border-b'>
        <div className='container flex items-center justify-between py-3'>
          <div className='flex items-center gap-3'>
            <span className='text-xl font-bold'>SIH25008</span>
            <span className='hidden sm:block text-sm text-gray-500'>Disaster Prep & Response Education</span>
          </div>
          <div className='flex items-center gap-2'>
            <select className='border rounded-xl px-3 py-2' value={role} onChange={e => setRole(e.target.value as any)}>
              <option>Student</option>
              <option>Teacher</option>
              <option>Admin</option>
            </select>
          </div>
        </div>
      </header>

      {incoming && (
        <div className='container mt-3'>
          <div className='card border-l-4 border-l-red-500'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='font-semibold'>New Alert: {incoming.title}</div>
                <div className='text-sm text-gray-600'>{incoming.message} — <span className='badge'>{incoming.region}</span></div>
              </div>
              <button className='btn btn-secondary' onClick={() => setIncoming(null)}>Dismiss</button>
            </div>
          </div>
        </div>
      )}

      <nav className='container mt-4'>
        <div className='grid grid-cols-5 gap-2'>
          {(['Home','Learn','Drills','Directory','Dashboard'] as Tab[]).map(name => (
            <button key={name} className={'btn ' + (tab===name ? 'btn-primary' : 'btn-secondary')} onClick={() => setTab(name)}>{name}</button>
          ))}
        </div>
      </nav>

      <main className='container my-4 grid gap-4'>
        {tab === 'Home' && <Home />}
        {tab === 'Learn' && <Learn />}
        {tab === 'Drills' && <Drills />}
        {tab === 'Directory' && <Directory />}
        {tab === 'Dashboard' && <Dashboard />}
      </main>

      <footer className='container py-6 text-center text-sm text-gray-500'>
        Built for education — extend freely.
      </footer>
    </div>
  )
}
