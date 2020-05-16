import { Router } from 'express'
import { GroupController } from '../controllers'
import { auth, emailConfirmation, isInGroup, isCreatorOrAdmin } from '../middlewares'
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
// Update group
routes.put('/groups/:id', auth, emailConfirmation, isCreatorOrAdmin, uploadImg.single('file'), GroupController.update)
// Logout of group
routes.delete('/groups/logout/:id', auth, emailConfirmation, GroupController.logoutGroup)
// Logout of group
routes.delete('/groups/participant/remove/:id/:idParticipant', auth, emailConfirmation, isCreatorOrAdmin, GroupController.removeParticipantGroup)

export default routes
