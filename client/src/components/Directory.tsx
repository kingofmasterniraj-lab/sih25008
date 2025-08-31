import { useEffect, useState } from 'react'
import { useApp } from '../store'
import { api } from '../api'

export default function Directory() {
  const { region } = useApp()
  const [contacts, setContacts] = useState<any[]>([])

  useEffect(() => {
    api.get('/contacts', { params: { region } }).then(r => setContacts(r.data))
  }, [region])

  return (
    <div className='card'>
      <div className='font-semibold mb-2'>Emergency Contacts — <span className='badge'>{region}</span></div>
      <div className='grid gap-2'>
        {contacts.map(c => (
          <div key={c.id} className='p-3 border rounded-xl bg-yellow-50'>
            <div className='font-semibold'>{c.label}</div>
            <div className='text-sm'>{c.phone}</div>
          </div>
        ))}
        {contacts.length===0 && <div className='text-sm text-gray-500'>No contacts for this region.</div>}
      </div>
    </div>
  )
}
