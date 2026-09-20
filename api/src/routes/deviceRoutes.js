import express from 'express'
import * as deviceController from '../controllers/deviceController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/categories', authMiddleware, deviceController.getAllDeviceCategories)
router.post('/categories', authMiddleware, deviceController.createDeviceCategory)

router.get('/', authMiddleware, deviceController.getAllDevices)
router.post('/', authMiddleware, deviceController.createDevice)
router.get('/:id', authMiddleware, deviceController.getDeviceById)
router.patch('/:id', authMiddleware, deviceController.updateDevice)
router.delete('/:id', authMiddleware, deviceController.deleteDevice)

export default router
