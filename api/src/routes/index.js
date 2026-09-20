import express from 'express'
import authRoutes from './authRoutes.js'
import customerRoutes from './customerRoutes.js'
import deviceRoutes from './deviceRoutes.js'
import ticketRoutes from './ticketRoutes.js'
import partRoutes from './partRoutes.js'
import invoiceRoutes from './invoiceRoutes.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/customers', customerRoutes)
router.use('/devices', deviceRoutes)
router.use('/tickets', ticketRoutes)
router.use('/parts', partRoutes)
router.use('/invoices', invoiceRoutes)

export default router
