import pool from '../config/db.js'

export const checkWarranty = async (req, res) => {
  try {
    const { ticket_number } = req.params

    const result = await pool.query(
      `SELECT id, ticket_number, status, warranty_expires_at, 
              (warranty_expires_at > CURRENT_TIMESTAMP) as is_valid
       FROM tickets 
       WHERE ticket_number = $1`,
      [ticket_number]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' })
    }

    const ticket = result.rows[0]
    res.json({
      ticket_number: ticket.ticket_number,
      is_valid: ticket.is_valid,
      expires_at: ticket.warranty_expires_at,
      status: ticket.status
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
