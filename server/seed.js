import db from './src/db.js'

const seed = () => {
  const conn = db.get()

  // Institutions
  const instStmt = conn.prepare('INSERT INTO institutions (name, state, district) VALUES (?, ?, ?)')
  ;[
    ['Govt Sr Sec School Model Town', 'Punjab', 'Ludhiana'],
    ['Govt College for Boys', 'Punjab', 'Ludhiana'],
    ['Govt Polytechnic College', 'Punjab', 'Amritsar']
  ].forEach(r => instStmt.run(...r))

  // Modules
  const modulesStmt = conn.prepare('INSERT INTO modules (title, hazard, content) VALUES (?, ?, ?)')
  const moduleData = [
    ['Earthquake Basics (Drop, Cover, Hold)', 'Earthquake', `Understand safe actions during tremors; identify safe zones in classrooms; practice evacuation routes. India lies in seismic zones—this module focuses on school safety.`],
    ['Flood Readiness (Monsoon Focus)', 'Flood', `Monsoon floods affect large parts of India. Learn early warnings, emergency kits, safe routes to higher ground, and campus water-logging checklists.`],
    ['Fire Safety (Labs & Hostels)', 'Fire', `Prevent, detect, and respond to fire incidents. Covers extinguisher types (PASS), lab safety, hostel evacuation, and assembly points.`]
  ]
  moduleData.forEach(m => modulesStmt.run(...m))

  // Quiz Questions
  const moduleIds = conn.prepare('SELECT id, hazard FROM modules').all()
  const qStmt = conn.prepare('INSERT INTO quiz_questions (module_id, question, options, correct_index) VALUES (?, ?, ?, ?)')
  moduleIds.forEach(({ id, hazard }) => {
    if (hazard === 'Earthquake') {
      qStmt.run(id, 'During an earthquake, the safest immediate action is?', JSON.stringify(['Run outside', 'Drop, Cover and Hold', 'Stand under a door frame', 'Use the lift']), 1)
      qStmt.run(id, 'Where is the safest place in a classroom?', JSON.stringify(['Near windows', 'Under a sturdy desk', 'At the blackboard', 'In the corridor']), 1)
    } else if (hazard === 'Flood') {
      qStmt.run(id, 'What should you do first after a flood warning?', JSON.stringify(['Wait and watch', 'Move to higher ground', 'Go to the basement', 'Swim across water']), 1)
      qStmt.run(id, 'What belongs in an emergency kit?', JSON.stringify(['Snacks only', 'Torch, water, radio, meds', 'Laptop', 'Sports gear']), 1)
    } else if (hazard === 'Fire') {
      qStmt.run(id, 'PASS stands for?', JSON.stringify(['Pull, Aim, Squeeze, Sweep', 'Push, Alert, Save, Spray', 'Pull, Alert, Stop, Sweep', 'Push, Aim, Stop, Spray']), 0)
      qStmt.run(id, 'Best way to evacuate during fire is?', JSON.stringify(['Use lift', 'Use nearest stairs', 'Wait for help', 'Return for items']), 1)
    }
  })

  // Drills
  const dStmt = conn.prepare('INSERT INTO drills (title, hazard, steps, scheduled_at) VALUES (?, ?, ?, ?)')
  dStmt.run('Quarterly Earthquake Drill', 'Earthquake', JSON.stringify([
    { label: 'Alarm & Drop, Cover, Hold', seconds: 20 },
    { label: 'Evacuate via stairs', seconds: 40 },
    { label: 'Assemble & headcount', seconds: 30 }
  ]), new Date(Date.now() + 86400000).toISOString()) // +1 day
  dStmt.run('Monsoon Flood Evacuation Drill', 'Flood', JSON.stringify([
    { label: 'Move to higher floors', seconds: 30 },
    { label: 'Check emergency kits', seconds: 20 },
    { label: 'Roll call & debrief', seconds: 30 }
  ]), new Date(Date.now() + 2*86400000).toISOString()) // +2 days

  // Alerts
  const aStmt = conn.prepare('INSERT INTO alerts (title, message, region) VALUES (?, ?, ?)')
  aStmt.run('Heat Advisory', 'High temperatures expected—hydrate and avoid noon sports.', 'Punjab/Ludhiana')
  aStmt.run('Local Flood Watch', 'Heavy rain forecast—clear drains and check campus water-logging.', 'Punjab/Amritsar')

  // Contacts
  const cStmt = conn.prepare('INSERT INTO contacts (label, phone, region) VALUES (?, ?, ?)')
  ;[
    ['NDMA Helpline', '011-1078', 'India/National'],
    ['Punjab State Disaster Management Authority', '0172-2740274', 'Punjab/State'],
    ['Ludhiana Fire Control Room', '0161-2740162', 'Punjab/Ludhiana'],
    ['Amritsar District Control Room', '0183-2564484', 'Punjab/Amritsar'],
    ['Ambulance (108)', '108', 'India/National'],
    ['Police (100)', '100', 'India/National']
  ].forEach(r => cStmt.run(...r))

  console.log('Seed complete.')
}

seed()
