import { Router } from 'express'
import { AuthController } from '../controllers'
import { auth, emailConfirmation } from '../middlewares'

const routes = Router()

// Login
routes.post('/login', AuthController.login)
// Load user with email confirmation
routes.get('/load/user', auth, emailConfirmation, AuthController.loadUser)
// Load user no email confirmation
routes.get('/load', auth, AuthController.loadUser)

export default routes
