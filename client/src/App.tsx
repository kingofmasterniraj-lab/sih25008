import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import io from 'socket.io-client'
import Home from './pages/Home'
import Drills from './pages/Drills'
import AddDrill from './pages/AddDrill'

export default function App() {
  const [incoming, setIncoming] = useState<any | null>(null)
  const [soundReady, setSoundReady] = useState(false)

  // Ref for alert audio
  const alertAudio = useRef<HTMLAudioElement | null>(null)

  // Create audio element once
  useEffect(() => {
    alertAudio.current = new Audio('/alert.mp3')
    alertAudio.current.loop = true
  }, [])

  // Unlock audio after user gesture (mobile fix)
  useEffect(() => {
    const enableAudio = () => {
      if (alertAudio.current) {
        alertAudio.current.play().then(() => {
          alertAudio.current!.pause()
          alertAudio.current!.currentTime = 0
          setSoundReady(true)
          window.removeEventListener('click', enableAudio)
          window.removeEventListener('touchstart', enableAudio)
        }).catch(() => {})
      }
    }
    window.addEventListener('click', enableAudio)
    window.addEventListener('touchstart', enableAudio)
    return () => {
      window.removeEventListener('click', enableAudio)
      window.removeEventListener('touchstart', enableAudio)
    }
  }, [])

  // Socket: listen for broadcast alerts
  useEffect(() => {
    const socket = io()
    socket.on('alert:new', (data) => {
      setIncoming(data)
      alertAudio.current?.play().catch(() => {
        console.log('Autoplay blocked; tap screen to enable sound.')
      })
    })
    return () => socket.disconnect()
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <header className="bg-blue-600 text-white p-4 flex justify-between">
          <Link to="/" className="font-bold">Disaster Prep</Link>
          <nav className="space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/drills" className="hover:underline">Drills</Link>
            <Link to="/add-drill" className="hover:underline">Add Drill</Link>
          </nav>
        </header>

        {/* Banner if sound not ready */}
        {!soundReady && (
          <div className="container mx-auto mt-3 px-4">
            <div className="p-3 bg-yellow-50 border rounded-xl flex items-center justify-between">
              <span className="text-sm">🔊 Tap "Enable Sound" so alerts can play a siren.</span>
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => {
                  alertAudio.current?.play().then(() => {
                    alertAudio.current?.pause()
                    if (alertAudio.current) alertAudio.current.currentTime = 0
                    setSoundReady(true)
                  }).catch(() => {})
                }}
              >
                Enable Sound
              </button>
            </div>
          </div>
        )}

        {/* Incoming Alert Banner */}
        {incoming && (
          <div className="container mx-auto mt-4 px-4">
            <div className="p-4 bg-red-100 border border-red-500 rounded-xl">
              <div className="font-bold text-red-700">🚨 Emergency Alert</div>
              <div className="text-gray-800">{incoming.message}</div>
              <button
                className="mt-2 bg-red-600 text-white px-4 py-1 rounded"
                onClick={() => {
                  setIncoming(null)
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
        )}

        {/* Routes */}
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/drills" element={<Drills />} />
            <Route path="/add-drill" element={<AddDrill />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

