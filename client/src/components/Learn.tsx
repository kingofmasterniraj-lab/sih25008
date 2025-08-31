import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Learn() {
  const [modules, setModules] = useState<any[]>([])
  const [active, setActive] = useState<any | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<any | null>(null)

  useEffect(() => {
    api.get('/modules').then(r => setModules(r.data))
  }, [])

  const open = async (m: any) => {
    const r = await api.get(`/modules/${m.id}`)
    setActive(r.data)
    setAnswers(new Array(r.data.questions.length).fill(-1))
    setResult(null)
  }

  const submit = async () => {
    const r = await api.post('/quizzes/submit', { moduleId: active.id, answers, role: localStorage.getItem('role') || 'Student' })
    setResult(r.data)
  }

  return (
    <div className='grid gap-4'>
      <div className='card'>
        <div className='font-semibold mb-2'>Modules</div>
        <div className='grid sm:grid-cols-3 gap-3'>
          {modules.map(m => (
            <button key={m.id} className='p-3 border rounded-xl hover:bg-gray-50 text-left' onClick={() => open(m)}>
              <div className='text-sm text-gray-600'>{m.hazard}</div>
              <div className='font-semibold'>{m.title}</div>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div className='card'>
          <div className='text-sm text-gray-600'>{active.hazard}</div>
          <div className='text-lg font-semibold'>{active.title}</div>
          <p className='mt-2 whitespace-pre-line'>{active.content}</p>

          <div className='mt-4'>
            <div className='font-semibold mb-2'>Quiz</div>
            {active.questions.map((q: any, i: number) => (
              <div key={q.id} className='mb-3'>
                <div className='font-medium'>{i+1}. {q.question}</div>
                <div className='grid sm:grid-cols-2 gap-2 mt-1'>
                  {q.options.map((opt: string, idx: number) => (
                    <label key={idx} className={'border rounded-xl px-3 py-2 cursor-pointer ' + (answers[i]===idx?'bg-blue-50 border-blue-300':'')}>
                      <input type='radio' name={`q${i}`} className='mr-2' checked={answers[i]===idx} onChange={() => {
                        const copy = [...answers]; copy[i]=idx; setAnswers(copy)
                      }} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button className='btn btn-primary' onClick={submit}>Submit Quiz</button>
            {result && (
              <div className='mt-3 p-3 border rounded-xl bg-green-50'>
                Score: <b>{result.score}/{result.total}</b> — Badge: <b>{result.badge}</b>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
