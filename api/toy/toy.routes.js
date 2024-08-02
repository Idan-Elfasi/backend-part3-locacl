import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { logMiddleware } from '../../middlewares/logger.middlewares.js'

import { getToys, getToyById, addToy, updateToy, removeToy, addToyMsg, removeToyMsg } from './toy.controller.js'

export const toyRoutes = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

toyRoutes.get('/', logMiddleware, getToys)
toyRoutes.get('/:id', getToyById)
toyRoutes.post('/', requireAuth, addToy)
toyRoutes.put('/:id', requireAuth, updateToy)
toyRoutes.delete('/:id', requireAuth, removeToy)
// router.delete('/:id', requireAuth, requireAdmin, removeToy)

toyRoutes.post('/:id/msg', requireAuth, addToyMsg)
toyRoutes.delete('/:id/msg/:msgId', requireAuth, removeToyMsg)