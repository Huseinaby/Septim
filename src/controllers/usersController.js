const pool = require('../config/db');

const getUserById = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, username, email, created_at
      FROM users
      WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getUserById
};