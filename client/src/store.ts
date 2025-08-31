import { create } from 'zustand'

type Role = 'Student' | 'Teacher' | 'Admin'

interface AppState {
  role: Role
  region: string // e.g., "Punjab/Ludhiana"
  setRole: (r: Role) => void
  setRegion: (r: string) => void
}

export const useApp = create<AppState>((set) => ({
  role: (localStorage.getItem('role') as Role) || 'Student',
  region: localStorage.getItem('region') || 'Punjab/Ludhiana',
  setRole: (role) => { localStorage.setItem('role', role); set({ role }) },
  setRegion: (region) => { localStorage.setItem('region', region); set({ region }) }
}))
