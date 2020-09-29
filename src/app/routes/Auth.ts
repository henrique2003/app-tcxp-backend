import { Router } from 'express'
import { AuthController } from '../controllers'
import { auth, emailConfirmation } from '../middlewares'

const routes = Router()

// Login
routes.post('/login', AuthController.login)
// Load user
routes.get('/load', auth, emailConfirmation, AuthController.loadUser)

export default routes
