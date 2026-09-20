import express from 'express'
import * as partController from '../controllers/partController.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authMiddleware, partController.getAllParts)
router.post('/', authMiddleware, requireRole('owner'), partController.createPart)
router.patch('/:id', authMiddleware, requireRole('owner'), partController.updatePart)

export default router
