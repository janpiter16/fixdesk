import express from 'express'
import * as invoiceController from '../controllers/invoiceController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.post('/', authMiddleware, invoiceController.createInvoice)
router.get('/ticket/:ticketId', authMiddleware, invoiceController.getInvoiceByTicket)

export default router
