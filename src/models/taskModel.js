const db = require('../config/db');

const Task = {
  async create({ userId, title, status, details, dueDate }) {
    const result = await db.query(
      `INSERT INTO tasks (user_id, title, status, details, due_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, title, status, details, dueDate]
    );
    return result.rows[0];
  },

  async findAllByUser(userId) {
    const result = await db.query(
      `SELECT * FROM tasks
       WHERE user_id = $1
       ORDER BY due_date NULLS LAST, created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  async findById(id, userId) {
    const result = await db.query(
      `SELECT * FROM tasks
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return result.rows[0];
  },

  async update(id, userId, { title, status, details, dueDate }) {
    // build dynamic set clause
    const fields = [];
    const values = [];
    let idx = 1;

    if (title !== undefined) {
      fields.push(`title = $${idx++}`);
      values.push(title);
    }
    if (status !== undefined) {
      fields.push(`status = $${idx++}`);
      values.push(status);
    }
    if (details !== undefined) {
      fields.push(`status = $${idx++}`);
      values.push(details);
    }
    if (dueDate !== undefined) {
      fields.push(`due_date = $${idx++}`);
      values.push(dueDate);
    }

    if (fields.length === 0) return this.findById(id, userId);

    values.push(id, userId);
    const result = await db.query(
      `UPDATE tasks
       SET ${fields.join(', ')}
       WHERE id = $${idx++} AND user_id = $${idx}
       RETURNING *`,
      values
    );
    return result.rows[0];
  },

  async delete(id, userId) {
    const result = await db.query(
      `DELETE FROM tasks
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, userId]
    );
    return result.rows[0];
  }
};

module.exports = Task;