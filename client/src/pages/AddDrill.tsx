import { useState, FormEvent } from 'react'
import { api } from '../api'

export default function AddDrill() {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [region, setRegion] = useState<string>('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/drills', { title, description, region })
      alert('Drill added successfully!')
      setTitle('')
      setDescription('')
      setRegion('')
    } catch (err: any) {
      alert('Error adding drill: ' + err.message)
    }
  }

  return (
    <div>
      <h2>Add New Drill</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Region"
          value={region}
          onChange={e => setRegion(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <button type="submit">Add Drill</button>
      </form>
    </div>
  )
}
