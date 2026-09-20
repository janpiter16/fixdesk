import express from 'express'
import * as warrantyController from '../controllers/warrantyController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/check/:ticket_number', authMiddleware, warrantyController.checkWarranty)

export default router
