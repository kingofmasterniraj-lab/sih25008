import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, '..', 'data.db')
let db

const init = () => {
  if (db) return db
  db = new Database(dbPath)

  db.exec(`
    CREATE TABLE IF NOT EXISTS institutions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      state TEXT,
      district TEXT
    );
    CREATE TABLE IF NOT EXISTS modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      hazard TEXT NOT NULL,
      content TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id INTEGER,
      question TEXT NOT NULL,
      options TEXT NOT NULL, -- JSON array
      correct_index INTEGER NOT NULL,
      FOREIGN KEY (module_id) REFERENCES modules(id)
    );
    CREATE TABLE IF NOT EXISTS drills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      hazard TEXT NOT NULL,
      steps TEXT NOT NULL, -- JSON array of steps with seconds each
      scheduled_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS drill_participation (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      drill_id INTEGER,
      participant_role TEXT,
      completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (drill_id) REFERENCES drills(id)
    );
    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      region TEXT NOT NULL, -- e.g., "Punjab/Ludhiana"
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      phone TEXT NOT NULL,
      region TEXT NOT NULL
    );
  `)
  return db
}

const get = () => {
  if (!db) init()
  return db
}

export default { init, get }
