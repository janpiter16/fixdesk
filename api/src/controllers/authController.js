import pool from '../config/db.js'
import { generateToken } from '../utils/jwt.js'
import { hashPassword, comparePassword } from '../utils/password.js'

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const result = await pool.query(
      'SELECT id, email, password_hash, full_name, role, is_active FROM users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const user = result.rows[0]

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is inactive' })
    }

    const passwordMatch = await comparePassword(password, user.password_hash)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = generateToken(user)

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const register = async (req, res) => {
  try {
    const { email, password, full_name, phone } = req.body

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password, and full name required' })
    }

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    const passwordHash = await hashPassword(password)

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role, phone, is_active)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING id, email, full_name, role`,
      [email, passwordHash, full_name, 'front_office', phone || null]
    )

    const user = result.rows[0]
    const token = generateToken(user)

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const me = async (req, res) => {
  try {
    const user = req.user
    res.json({ user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
