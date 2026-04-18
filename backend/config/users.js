const bcrypt = require('bcryptjs');
const { getDb } = require('./database');

const UserStore = {
  findByEmail: (email) => {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email);
  },

  findById: (id) => {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  },

  create: async ({ name, email, password }) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const id = `user_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const createdAt = new Date().toISOString();

    const db = getDb();
    db.prepare(
      'INSERT INTO users (id, name, email, password, createdAt) VALUES (?, ?, ?, ?, ?)'
    ).run(id, name, email.toLowerCase(), hashedPassword, createdAt);

    return { id, name, email: email.toLowerCase(), password: hashedPassword, createdAt };
  },

  comparePassword: async (plain, hashed) => bcrypt.compare(plain, hashed),

  sanitize: (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }),
};

module.exports = UserStore;
