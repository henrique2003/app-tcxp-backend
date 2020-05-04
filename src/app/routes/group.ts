import { Router } from 'express'
import { GroupController } from '../controllers'
import { auth, emailConfirmation, userExists } from '../middlewares'

const router = Router()

// Index all groups
router.get('/groups', GroupController.index)
// Create a new Group
router.post('/groups', auth, emailConfirmation, GroupController.store)
// Index your groups
router.get('/groups/mine', auth, emailConfirmation, userExists, GroupController.mine)
// Show especify group
router.get('/group/:id', GroupController.show)

export default router
