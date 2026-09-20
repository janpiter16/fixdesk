import pool from '../config/db.js'

export const getAllParts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM spare_parts WHERE is_active = true ORDER BY name ASC'
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const createPart = async (req, res) => {
  try {
    const { part_code, name, category, unit, purchase_price, selling_price, stock_qty, min_stock } = req.body

    const result = await pool.query(
      `INSERT INTO spare_parts 
       (part_code, name, category, unit, purchase_price, selling_price, stock_qty, min_stock)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [part_code, name, category, unit || 'pcs', purchase_price, selling_price, stock_qty || 0, min_stock || 0]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updatePart = async (req, res) => {
  try {
    const { id } = req.params
    const { name, category, unit, purchase_price, selling_price, stock_qty, min_stock } = req.body

    const result = await pool.query(
      `UPDATE spare_parts
       SET name = COALESCE($1, name),
           category = COALESCE($2, category),
           unit = COALESCE($3, unit),
           purchase_price = COALESCE($4, purchase_price),
           selling_price = COALESCE($5, selling_price),
           stock_qty = COALESCE($6, stock_qty),
           min_stock = COALESCE($7, min_stock),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [name, category, unit, purchase_price, selling_price, stock_qty, min_stock, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Part not found' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
