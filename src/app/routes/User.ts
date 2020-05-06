import { Router } from 'express'
import UserController from '../controllers/user-controller'
import { auth, emailConfirmation } from '../middlewares'

const routes = Router()

// List all Users
// Store
routes.post('/users', UserController.store)
// Show
routes.get('/user/:id', UserController.show)
// Update
routes.put('/users', auth, emailConfirmation, UserController.update)
// Destroy
routes.delete('/users', auth, UserController.destroy)

export default routes
