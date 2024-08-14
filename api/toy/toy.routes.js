import express from 'express'
import { requireAdmin, requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { logMiddleware } from '../../middlewares/logger.middlewares.js'

import { getToys, getToyById, addToy, updateToy, removeToy, addToyMsg, removeToyMsg } from './toy.controller.js'

export const toyRoutes = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

toyRoutes.get('/', logMiddleware, getToys )
toyRoutes.get('/:id', requireAuth  , getToyById )
toyRoutes.post('/', requireAuth ,requireAdmin,  addToy )
toyRoutes.put('/:id', requireAuth, requireAdmin ,  updateToy )
toyRoutes.delete('/:id', requireAuth ,requireAdmin,  removeToy )
// router.delete('/:id', requireAuth, requireAdmin, removeToy)

toyRoutes.post('/:id/msg', requireAuth, addToyMsg)
toyRoutes.delete('/:id/msg/:msgId', requireAuth, removeToyMsg)