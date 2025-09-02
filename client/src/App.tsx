import { useState, FormEvent } from 'react'
import { api } from './api'

export default function AddDrill() {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [region, setRegion] = useState<string>('')

  const playAlertSound = () => {
    const audio = new Audio('/alert.mp3')
    audio.play().catch(() => {})
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/drills', { title, description, region })
      alert('✅ Drill added successfully!')
      playAlertSound()   // 🔊 play siren when drill is added
      setTitle('')
      setDescription('')
      setRegion('')
    } catch (err: any) {
      alert('❌ Error adding drill: ' + err.message)
    }
  }

  return (
    <div className="card p-4">
      <h2 className="text-xl font-bold mb-3">Add New Drill</h2>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="input input-bordered"
        />
        <input
          placeholder="Region"
          value={region}
          onChange={e => setRegion(e.target.value)}
          className="input input-bordered"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          className="textarea textarea-bordered"
        />
        <button type="submit" className="btn btn-primary">Add Drill</button>
      </form>
    </div>
  )
}

