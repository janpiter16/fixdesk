import pool from '../config/db.js'

export const getAllCustomers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, phone, email, address, created_at FROM customers ORDER BY created_at DESC'
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      'SELECT id, full_name, phone, email, address, notes, created_at, updated_at FROM customers WHERE id = $1',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const createCustomer = async (req, res) => {
  try {
    const { full_name, phone, email, address, notes } = req.body

    if (!full_name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' })
    }

    const result = await pool.query(
      `INSERT INTO customers (full_name, phone, email, address, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, phone, email, address, created_at`,
      [full_name, phone, email || null, address || null, notes || null]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params
    const { full_name, phone, email, address, notes } = req.body

    const result = await pool.query(
      `UPDATE customers 
       SET full_name = COALESCE($1, full_name),
           phone = COALESCE($2, phone),
           email = COALESCE($3, email),
           address = COALESCE($4, address),
           notes = COALESCE($5, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING id, full_name, phone, email, address, notes, updated_at`,
      [full_name || null, phone || null, email || null, address || null, notes || null, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM customers WHERE id = $1 RETURNING id',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    res.json({ message: 'Customer deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
