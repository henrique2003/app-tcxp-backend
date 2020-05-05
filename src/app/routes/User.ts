import { Router } from 'express'
import UserController from '../controllers/user-controller'
import { auth, emailConfirmation, userExists } from '../middlewares'

const routes = Router()

// List all Users
// Store
routes.post('/users', UserController.store)
// Show
routes.get('/user/:id', UserController.show)
// Index
routes.get('/users', auth, UserController.index)
// Update
routes.put('/users', auth, userExists, emailConfirmation, UserController.update)
// Destroy
routes.delete('/users', auth, userExists, UserController.destroy)

export default routes
