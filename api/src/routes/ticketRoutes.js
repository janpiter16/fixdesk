import express from 'express'
import * as ticketController from '../controllers/ticketController.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.post('/', authMiddleware, ticketController.createTicket)
router.get('/', authMiddleware, ticketController.getAllTickets)
router.get('/:id', authMiddleware, ticketController.getTicketById)
router.patch('/:id/status', authMiddleware, requireRole('owner', 'technician'), ticketController.updateTicketStatus)
router.patch('/:id/assign', authMiddleware, requireRole('owner', 'technician'), ticketController.assignTicket)

router.get('/track/:token', ticketController.getTicketByTrackingToken)

export default router
