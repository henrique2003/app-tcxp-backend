"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const multer_s3_1 = __importDefault(require("../middlewares/multer-s3"));
const routes = express_1.Router();
// Index all groups
routes.get('/groups', controllers_1.GroupController.index);
// Create a new Group
routes.post('/groups', middlewares_1.auth, middlewares_1.emailConfirmation, controllers_1.GroupController.store);
// Index your groups
routes.get('/groups/mine', middlewares_1.auth, middlewares_1.emailConfirmation, controllers_1.GroupController.mine);
// Show especify group
routes.get('/group/:id', controllers_1.GroupController.show);
// Inivite request
routes.post('/groups/invite/request', middlewares_1.auth, middlewares_1.emailConfirmation, middlewares_1.isInGroup, controllers_1.GroupController.inviteRequest);
// Accept request
routes.post('/groups/accept/request', middlewares_1.auth, middlewares_1.emailConfirmation, controllers_1.GroupController.acceptRequest);
// Update group
routes.put('/groups/:id', middlewares_1.auth, middlewares_1.emailConfirmation, middlewares_1.isCreatorOrAdmin, multer_s3_1.default.single('file'), controllers_1.GroupController.update);
// Move member to admin
routes.put('/groups/admin/:id', middlewares_1.auth, middlewares_1.emailConfirmation, middlewares_1.isCreatorOrAdmin, controllers_1.GroupController.moveToAdmin);
// Logout of group
routes.delete('/groups/logout/:id', middlewares_1.auth, middlewares_1.emailConfirmation, controllers_1.GroupController.logoutGroup);
// Logout of group
routes.delete('/groups/participant/remove/:id', middlewares_1.auth, middlewares_1.emailConfirmation, middlewares_1.isCreatorOrAdmin, controllers_1.GroupController.removeParticipantGroup);
// Destroy group
routes.delete('/groups/:id', middlewares_1.auth, middlewares_1.emailConfirmation, middlewares_1.isCreator, controllers_1.GroupController.destroy);
// New Message
routes.put('/group/message/new/:id', middlewares_1.auth, middlewares_1.emailConfirmation, middlewares_1.isInGroup, controllers_1.GroupController.storeMessage);
exports.default = routes;
