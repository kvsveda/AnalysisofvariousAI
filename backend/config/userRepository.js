const { getDb } = require('./database');

function normalizeUserFromClaims(claims) {
  const id = claims.sub;
  const email = claims.email || claims.email_address || null;
  const fullName = claims.name || [claims.first_name, claims.last_name].filter(Boolean).join(' ').trim() || null;

  return {
    id,
    email,
    name: fullName,
  };
}

function createUserIfNotExists(user) {
  const db = getDb();
  const now = new Date().toISOString();

  const columns = db.prepare('PRAGMA table_info(users)').all();
  const columnNames = new Set(columns.map((col) => col.name));

  const insertPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: now,
    updatedAt: now,
    password: '__CLERK_AUTH__',
  };

  const availableColumns = Object.keys(insertPayload).filter((key) => columnNames.has(key));
  const values = availableColumns.map((key) => insertPayload[key]);

  const updateColumns = ['email', 'name', 'updatedAt'].filter((key) => columnNames.has(key));
  const updateSql = updateColumns.length
    ? updateColumns.map((key) => `${key} = excluded.${key}`).join(', ')
    : 'id = excluded.id';

  const sql = `
    INSERT INTO users (${availableColumns.join(', ')})
    VALUES (${availableColumns.map(() => '?').join(', ')})
    ON CONFLICT(id) DO UPDATE SET ${updateSql}
  `;

  db.prepare(sql).run(...values);

  return db.prepare('SELECT id, email, name, createdAt FROM users WHERE id = ?').get(user.id);
}

module.exports = {
  normalizeUserFromClaims,
  createUserIfNotExists,
};
