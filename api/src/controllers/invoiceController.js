import pool from '../config/db.js'

export const createInvoice = async (req, res) => {
  try {
    const { ticket_id, items, discount_amount, payment_method, paid_amount } = req.body
    const userId = req.user.id

    // Check ticket
    const ticketRes = await pool.query('SELECT * FROM tickets WHERE id = $1', [ticket_id])
    if (ticketRes.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' })
    }

    let subtotalParts = 0
    let subtotalService = ticketRes.rows[0].estimated_cost || 0

    // Process parts items
    if (items && items.length > 0) {
      for (const item of items) {
        subtotalParts += item.unit_price * item.qty
        // reduce stock
        await pool.query(
          'UPDATE spare_parts SET stock_qty = stock_qty - $1 WHERE id = $2',
          [item.qty, item.part_id]
        )
      }
    }

    const discount = discount_amount || 0
    const totalAmount = (Number(subtotalService) + Number(subtotalParts)) - Number(discount)
    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`
    const paymentStatus = Number(paid_amount) >= totalAmount ? 'paid' : 'partial'

    const invResult = await pool.query(
      `INSERT INTO invoices 
       (invoice_number, ticket_id, subtotal_service, subtotal_parts, discount_amount, total_amount, payment_method, payment_status, paid_amount, paid_at, processed_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        invoiceNumber, ticket_id, subtotalService, subtotalParts, discount, 
        totalAmount, payment_method, paymentStatus, paid_amount || 0, 
        paymentStatus === 'paid' ? new Date() : null, userId
      ]
    )

    // Update ticket status to completed / ready_pickup
    await pool.query(
      "UPDATE tickets SET status = 'completed', final_cost = $1 WHERE id = $2",
      [totalAmount, ticket_id]
    )

    res.status(201).json(invResult.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getInvoiceByTicket = async (req, res) => {
  try {
    const { ticketId } = req.params
    const result = await pool.query('SELECT * FROM invoices WHERE ticket_id = $1', [ticketId])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
