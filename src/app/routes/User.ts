import { Router } from 'express'
import UserController from '../controllers/user-controller'
import { auth, emailConfirmation } from '../middlewares'
import uploadImg from '../middlewares/multerS3'

const routes = Router()

// List all Users
// Store
routes.post('/users', UserController.store)
// Show
routes.get('/user/:id', UserController.show)
// Update
routes.put('/users', auth, emailConfirmation, uploadImg.single('file'), UserController.update)
// Destroy
routes.delete('/users', auth, UserController.destroy)

export default routes
