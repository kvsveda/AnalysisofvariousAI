const Database = require('better-sqlite3');
const path = require('path');

let db;

function getDb() {
  if (!db) {
    db = new Database(path.join(__dirname, '..', 'database.sqlite'));
    db.pragma('journal_mode = WAL');

    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL,
        prompt TEXT NOT NULL,
        modelsData TEXT NOT NULL,
        judgeData TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY(userId) REFERENCES users(id)
      );
    `);

    const userColumns = db.prepare('PRAGMA table_info(users)').all().map((col) => col.name);
    if (!userColumns.includes('updatedAt')) {
      db.exec('ALTER TABLE users ADD COLUMN updatedAt TEXT');
    }
  }
  return db;
}

module.exports = { getDb };
