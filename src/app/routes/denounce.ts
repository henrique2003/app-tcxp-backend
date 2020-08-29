import { Router } from 'express'
import Denounce from '../controllers/denounce-controller'
import { auth, emailConfirmation } from '../middlewares'

const router = Router()

// Register a new denounce
router.post('/denounce/:id', auth, emailConfirmation, Denounce.store)
// Show all denounces
router.get('/denounce', auth, Denounce.index)

export default router
