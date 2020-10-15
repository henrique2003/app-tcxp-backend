import { Router } from 'express'
import { GroupController } from '../controllers'
import { auth, emailConfirmation, isInGroup, isCreatorOrAdmin, isCreator } from '../middlewares'
import uploadImg from '../middlewares/multer-s3'

const routes = Router()

// Index all groups
routes.get('/groups', GroupController.index)
// Create a new Group
routes.post('/groups', auth, emailConfirmation, GroupController.store)
// Index your groups
routes.get('/groups/mine', auth, emailConfirmation, GroupController.mine)
// Show especify group
routes.get('/group/:id', GroupController.show)
// Inivite request
routes.post('/groups/invite/request', auth, emailConfirmation, isInGroup, GroupController.inviteRequest)
// Accept request
routes.post('/groups/accept/request', auth, emailConfirmation, GroupController.acceptRequest)
// Reject request
routes.post('/groups/reject/request', auth, emailConfirmation, GroupController.rejectRequest)
// Update group
routes.put('/groups/:id', auth, emailConfirmation, isCreatorOrAdmin, uploadImg.single('file'), GroupController.update)
// Move member to admin
routes.put('/groups/admin/:id', auth, emailConfirmation, isCreatorOrAdmin, GroupController.moveToAdmin)
// Logout of group
routes.delete('/groups/logout/:id', auth, emailConfirmation, GroupController.logoutGroup)
// Logout of group
routes.delete('/groups/participant/remove/:id', auth, emailConfirmation, isCreatorOrAdmin, GroupController.removeParticipantGroup)
// Destroy group
routes.delete('/groups/:id', auth, emailConfirmation, isCreator, GroupController.destroy)

// New Message
routes.put('/group/message/new/:id', auth, emailConfirmation, isInGroup, GroupController.storeMessage)

export default routes
