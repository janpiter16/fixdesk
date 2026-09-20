import pool from '../config/db.js'
import { generateTicketNumber, generateTrackingToken, generateQRCode } from '../utils/ticket.js'

export const createTicket = async (req, res) => {
  try {
    const { customer_id, device_id, device_serial, device_imei, device_password, issue_description, priority } = req.body
    const userId = req.user.id

    if (!customer_id || !issue_description) {
      return res.status(400).json({ error: 'Customer and issue description are required' })
    }

    const ticketNumber = generateTicketNumber()
    const trackingToken = generateTrackingToken()

    try {
      const qrCode = await generateQRCode(ticketNumber, trackingToken)

      const result = await pool.query(
        `INSERT INTO tickets 
         (ticket_number, customer_id, device_id, device_serial, device_imei, device_password, 
          issue_description, priority, intake_by, tracking_token, qr_code_url, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending')
         RETURNING id, ticket_number, customer_id, device_id, status, tracking_token, qr_code_url, created_at`,
        [ticketNumber, customer_id, device_id || null, device_serial || null, device_imei || null, 
         device_password || null, issue_description, priority || 'normal', userId, trackingToken, qrCode]
      )

      res.status(201).json(result.rows[0])
    } catch (qrErr) {
      console.error('QR generation error:', qrErr)
      res.status(500).json({ error: 'Failed to generate QR code' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getAllTickets = async (req, res) => {
  try {
    const { status, assigned_to, limit = 50, offset = 0 } = req.query
    let query = `
      SELECT t.id, t.ticket_number, t.customer_id, c.full_name as customer_name, 
             t.device_id, d.brand, d.model, t.status, t.priority, 
             t.created_at, t.assigned_to, u.full_name as assigned_to_name
      FROM tickets t
      LEFT JOIN customers c ON t.customer_id = c.id
      LEFT JOIN devices d ON t.device_id = d.id
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE 1=1
    `
    const params = []
    let paramCount = 1

    if (status) {
      query += ` AND t.status = $${paramCount}`
      params.push(status)
      paramCount++
    }

    if (assigned_to) {
      query += ` AND t.assigned_to = $${paramCount}`
      params.push(assigned_to)
      paramCount++
    }

    query += ' ORDER BY t.created_at DESC LIMIT $' + paramCount + ' OFFSET $' + (paramCount + 1)
    params.push(limit, offset)

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `SELECT t.*, c.full_name as customer_name, c.phone as customer_phone, c.email as customer_email,
              d.brand as device_brand, d.model as device_model, d.category_id,
              u1.full_name as intake_by_name, u2.full_name as assigned_to_name
       FROM tickets t
       LEFT JOIN customers c ON t.customer_id = c.id
       LEFT JOIN devices d ON t.device_id = d.id
       LEFT JOIN users u1 ON t.intake_by = u1.id
       LEFT JOIN users u2 ON t.assigned_to = u2.id
       WHERE t.id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const userId = req.user.id

    if (!status) {
      return res.status(400).json({ error: 'Status is required' })
    }

    const result = await pool.query(
      `UPDATE tickets 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, ticket_number, status, updated_at`,
      [status, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' })
    }

    await pool.query(
      `INSERT INTO ticket_logs (ticket_id, user_id, action, new_value)
       VALUES ($1, $2, $3, $4)`,
      [id, userId, 'status_changed', status]
    )

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const assignTicket = async (req, res) => {
  try {
    const { id } = req.params
    const { assigned_to } = req.body
    const userId = req.user.id

    if (!assigned_to) {
      return res.status(400).json({ error: 'Assigned user is required' })
    }

    const result = await pool.query(
      `UPDATE tickets 
       SET assigned_to = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, ticket_number, assigned_to, updated_at`,
      [assigned_to, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' })
    }

    await pool.query(
      `INSERT INTO ticket_logs (ticket_id, user_id, action, new_value)
       VALUES ($1, $2, $3, $4)`,
      [id, userId, 'assigned_to', assigned_to]
    )

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getTicketByTrackingToken = async (req, res) => {
  try {
    const { token } = req.params

    const result = await pool.query(
      `SELECT t.id, t.ticket_number, t.status, t.priority, t.issue_description, t.estimated_cost, 
              t.final_cost, t.created_at, t.completed_at, 
              c.full_name as customer_name, 
              d.brand as device_brand, d.model as device_model
       FROM tickets t
       LEFT JOIN customers c ON t.customer_id = c.id
       LEFT JOIN devices d ON t.device_id = d.id
       WHERE t.tracking_token = $1`,
      [token]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
