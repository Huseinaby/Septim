const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (
      typeof username !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: 'Invalid input. Please provide a valid username, email, and password.'
      });
    }

    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        message: 'Invalid email format.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long.'
      });
    }

    if (Buffer.byteLength(password, 'utf8') > 72) {
      return res.status(400).json({
        message: 'Password is too long. Maximum length is 72 characters.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email`,
      [normalizedUsername, normalizedEmail, hashedPassword]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        message: 'Username or email already exists.'
      });
    }
    console.error('Error creating user:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, email, created_at
      FROM users
      ORDER BY created_at DESC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

module.exports = router;