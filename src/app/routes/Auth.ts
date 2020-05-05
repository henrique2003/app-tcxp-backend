import { Router } from 'express'
import { AuthController } from '../controllers'
import { auth } from '../middlewares'

const routes = Router()

// Login
routes.post('/login', AuthController.login)
// Load user
routes.get('/load', auth, AuthController.loadUser)

export default routes
