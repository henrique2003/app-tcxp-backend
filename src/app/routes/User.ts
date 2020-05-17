import { Router } from 'express'
import UserController from '../controllers/user-controller'
import { auth, emailConfirmation } from '../middlewares'
import uploadImg from '../middlewares/multer-s3'

const routes = Router()

// List all Users
// Index
routes.get('/users', UserController.index)
// Store
routes.post('/users', UserController.store)
// Show
routes.get('/user/:id', UserController.show)
// Update
routes.put('/users', auth, emailConfirmation, uploadImg.single('file'), UserController.update)
// Destroy
routes.delete('/users', auth, UserController.destroy)
// Email Confirmation
routes.post('/email/confirmation', auth, UserController.emailConfirmation)
// Resend email confirmation
routes.get('/email/confirmation/resend', auth, UserController.emailConfirmationResend)
// Forgot password
routes.post('/forgot/password', UserController.forgotPassword)
// Forgot password confirm
routes.post('/forgot/password/confirm', UserController.forgotPasswordConfirm)

export default routes
