import pool from '../config/db.js'

export const getAllDeviceCategories = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, slug FROM device_categories ORDER BY name'
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const createDeviceCategory = async (req, res) => {
  try {
    const { name, slug } = req.body

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' })
    }

    const result = await pool.query(
      'INSERT INTO device_categories (name, slug) VALUES ($1, $2) RETURNING id, name, slug',
      [name, slug]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getAllDevices = async (req, res) => {
  try {
    const { category_id } = req.query
    let query = `
      SELECT d.id, d.category_id, d.brand, d.model, dc.name as category_name
      FROM devices d
      LEFT JOIN device_categories dc ON d.category_id = dc.id
    `
    const params = []

    if (category_id) {
      query += ' WHERE d.category_id = $1'
      params.push(category_id)
    }

    query += ' ORDER BY dc.name, d.brand, d.model'

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const createDevice = async (req, res) => {
  try {
    const { category_id, brand, model } = req.body

    if (!category_id || !brand || !model) {
      return res.status(400).json({ error: 'Category, brand, and model are required' })
    }

    const result = await pool.query(
      `INSERT INTO devices (category_id, brand, model)
       VALUES ($1, $2, $3)
       RETURNING id, category_id, brand, model`,
      [category_id, brand, model]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getDeviceById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      `SELECT d.id, d.category_id, d.brand, d.model, dc.name as category_name
       FROM devices d
       LEFT JOIN device_categories dc ON d.category_id = dc.id
       WHERE d.id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateDevice = async (req, res) => {
  try {
    const { id } = req.params
    const { category_id, brand, model } = req.body

    const result = await pool.query(
      `UPDATE devices 
       SET category_id = COALESCE($1, category_id),
           brand = COALESCE($2, brand),
           model = COALESCE($3, model)
       WHERE id = $4
       RETURNING id, category_id, brand, model`,
      [category_id || null, brand || null, model || null, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const deleteDevice = async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM devices WHERE id = $1 RETURNING id',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' })
    }

    res.json({ message: 'Device deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
