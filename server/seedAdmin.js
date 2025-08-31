import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt'; // if you hash passwords

async function seedAdmin() {
  const db = await open({
    filename: './src/database.sqlite', // adjust path if needed
    driver: sqlite3.Database
  });

  // Optional: hash password
  const password = await bcrypt.hash('admin123', 10);

  await db.run(
    `INSERT OR REPLACE INTO users (username, password, role) VALUES (?, ?, ?)`,
    ['admin', password, 'admin']
  );

  console.log('✅ Admin created: username=admin, password=admin123');
  await db.close();
}

seedAdmin();
