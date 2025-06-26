const db = require('../config/db');

const User = {
  async create({ name, email, passwordHash }) {
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, passwordHash]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await db.query(
      `SELECT id, name, email, created_at FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }
};

module.exports = User;