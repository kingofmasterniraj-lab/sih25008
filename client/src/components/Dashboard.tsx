import { useEffect, useState } from 'react'
import { api } from '../api'
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts'

export default function Dashboard() {
  const [s, setS] = useState<any | null>(null)

  useEffect(() => {
    api.get('/dashboard/summary').then(r => setS(r.data))
  }, [])

  return (
    <div className='grid gap-4'>
      <div className='card'>
        <div className='font-semibold mb-2'>Preparedness Score</div>
        <div className='h-56'>
          {s && (
            <ResponsiveContainer>
              <RadialBarChart innerRadius="40%" outerRadius="90%" barSize={20} data={[{name:'Score', value: s.preparednessScore}]} startAngle={180} endAngle={-180}>
                <RadialBar dataKey="value" />
                <Legend />
              </RadialBarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {s && (
        <div className='grid sm:grid-cols-3 gap-3'>
          <div className='card'><div className='text-sm text-gray-600'>Total Alerts</div><div className='text-2xl font-bold'>{s.totalAlerts}</div></div>
          <div className='card'><div className='text-sm text-gray-600'>Total Drills</div><div className='text-2xl font-bold'>{s.totalDrills}</div></div>
          <div className='card'><div className='text-sm text-gray-600'>Avg Drill Completion</div><div className='text-2xl font-bold'>{s.avgCompletion}%</div></div>
        </div>
      )}
    </div>
  )
}
