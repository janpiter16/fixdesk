import express from 'express'
import * as customerController from '../controllers/customerController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authMiddleware, customerController.getAllCustomers)
router.post('/', authMiddleware, customerController.createCustomer)
router.get('/:id', authMiddleware, customerController.getCustomerById)
router.patch('/:id', authMiddleware, customerController.updateCustomer)
router.delete('/:id', authMiddleware, customerController.deleteCustomer)

export default router
