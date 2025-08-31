import { useEffect, useState } from 'react'
import { useApp } from '../store'
import { api } from '../api'

export default function Home() {
  const { region, setRegion } = useApp()
  const [alerts, setAlerts] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [myRegion, setMyRegion] = useState(region)
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('role') === 'Admin')

  useEffect(() => {
    api.get('/alerts').then(r => setAlerts(r.data))
  }, [])

  const create = async () => {
    if (!isAdmin) return alert('Only Admin can create alerts')
    const res = await api.post('/alerts', { title, message, region: myRegion })
    setAlerts([res.data, ...alerts])
    setTitle(''); setMessage('')
  }

  return (
    <div className='grid gap-4'>
      <div className='card'>
        <div className='flex flex-col sm:flex-row sm:items-end gap-3'>
          <div className='flex-1'>
            <label className='block text-sm font-medium'>My Region</label>
            <select className='border rounded-xl px-3 py-2 w-full' value={myRegion} onChange={e => { setMyRegion(e.target.value); setRegion(e.target.value) }}>
              <option>Punjab/Ludhiana</option>
              <option>Punjab/Amritsar</option>
              <option>Punjab/State</option>
              <option>India/National</option>
            </select>
            <div className='text-xs text-gray-500 mt-1'>Used to filter alerts & contacts.</div>
          </div>
        </div>
      </div>

      <div className='card'>
        <div className='font-semibold mb-2'>Recent Alerts</div>
        <div className='grid gap-2'>
          {alerts.filter(a => a.region===myRegion || a.region==='India/National').map(a => (
            <div key={a.id} className='p-3 border rounded-xl bg-red-50'>
              <div className='font-semibold'>{a.title}</div>
              <div className='text-sm'>{a.message}</div>
              <div className='text-xs text-gray-600 mt-1'>{new Date(a.created_at).toLocaleString()}</div>
              <div className='badge mt-1'>{a.region}</div>
            </div>
          ))}
          {alerts.length===0 && <div className='text-sm text-gray-500'>No alerts yet.</div>}
        </div>
      </div>

      <div className='card'>
        <div className='flex items-center justify-between'>
          <div className='font-semibold'>Create Region-Specific Alert</div>
          <span className='badge'>{isAdmin ? 'Admin' : 'Read-only'}</span>
        </div>
        <div className='grid sm:grid-cols-3 gap-3 mt-2'>
          <input className='border rounded-xl px-3 py-2' placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
          <input className='border rounded-xl px-3 py-2 sm:col-span-2' placeholder='Message' value={message} onChange={e => setMessage(e.target.value)} />
        </div>
        <div className='mt-2'>
          <button className='btn btn-primary' onClick={create}>Broadcast Alert</button>
        </div>
        <div className='text-xs text-gray-500 mt-2'>Admin only. Sends instant push to all users.</div>
      </div>
    </div>
  )
}
