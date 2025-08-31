// client/src/api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://sih25008-backend.onrender.com/api'
})
