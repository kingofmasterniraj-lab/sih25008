import { useState, FormEvent } from 'react'
import { api } from './api'

export default function AddDrill() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [region, setRegion] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/drills', { title, description, region })
      alert('✅ Drill added successfully!')
      setTitle('')
      setDescription('')
      setRegion('')
    } catch (err: any) {
      alert('❌ Error adding drill: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6 space-y-4">
      <h2 className="text-xl font-semibold">➕ Add New Drill</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          className="border rounded-lg px-3 py-2"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          className="border rounded-lg px-3 py-2"
          placeholder="Region"
          value={region}
          onChange={e => setRegion(e.target.value)}
        />
        <textarea
          className="border rounded-lg px-3 py-2"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`btn ${loading ? 'btn-secondary' : 'btn-primary'}`}
        >
          {loading ? 'Saving...' : 'Add Drill'}
        </button>
      </form>
    </div>
  )
}

