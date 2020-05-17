import { Request, Response } from 'express'
import { Groups, User } from '../models'
import { isValidFields, cleanFields } from '../../utils'
import { serverError, missingParamError, fieldInUse, notFound, deleteSuccess } from '../errors'
import { responseWithToken, awsS3DeleteImage } from '../helpers'
import { validObjectId } from '../helpers/valid-object-id'

class GroupsController {
  public async index (req: Request, res: Response): Promise<Response> {
    try {
      const { page = 1 } = req.query

      const options = {
        perPage: page,
        populate: 'creator administrators members',
        limit: 10
      }

      const groups = await Groups.paginate({}, options)

      return res.status(200).json(responseWithToken(groups))
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }

  public async mine (req: Request, res: Response): Promise<Response> {
    try {
      const { userId, newToken } = req

      const creatorGroup = await Groups.find({ creator: userId })
      const adminGroup = await Groups.find({ administrators: userId })
      const memberGroup = await Groups.find({ members: userId })

      const groups = { creatorGroup, adminGroup, memberGroup }

      return res.status(200).json(responseWithToken(groups, newToken))
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }

  public async store (req: Request, res: Response): Promise<Response> {
    try {
      const { body, userId, newToken } = req
      req.body = cleanFields(body)

      const requiredFields = ['title', 'description']
      if (!isValidFields(requiredFields, body)) {
        return res.status(400).json(responseWithToken(missingParamError(), newToken))
      }

      if (await Groups.findOne({ title: body.title })) {
        return res.status(400).json(responseWithToken(fieldInUse('Nome do grupo'), newToken))
      }

      body.creator = await User.findById(userId)

      const group = await Groups.create(body)

      return res.status(200).json(responseWithToken(group, newToken))
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }

  public async show (req: Request, res: Response): Promise<Response> {
    try {
      const group = await Groups.findById(req.params.id).populate('creator administrators members')

      if (!group) return res.status(400).json(responseWithToken(notFound('Grupo')))

      return res.status(200).json(responseWithToken(group))
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }

  public async inviteRequest (req: Request, res: Response): Promise<Response> {
    try {
      const { body, newToken, userId } = req
      const { from, group } = body

      req.body = cleanFields(body)

      const requiredFields = ['from', 'group']
      if (!isValidFields(requiredFields, body)) {
        return res.status(400).json(responseWithToken(missingParamError(), newToken))
      }

      // Valid object id from
      if (!validObjectId(from)) {
        return res.status(400).json(responseWithToken(notFound('Convite'), newToken))
      }

      const isFrom = await User.findById(from)
      if (!isFrom) {
        return res.status(400).json(responseWithToken(notFound('Convite'), newToken))
      }

      const isGroup = await Groups.findById(group)
      if (!isGroup) {
        return res.status(400).json(responseWithToken(notFound('Convite'), newToken))
      }

      // Pick user to
      const userTo: any = await User.findById(userId)

      // if repeat invite
      for (const invite of userTo.inviteRequest) {
        if (invite.from == from && invite.group == group) {
          return res.status(400).json(responseWithToken('Convite já existe', newToken))
        }
      }

      const invite = {
        from: isFrom,
        group: isGroup
      }

      userTo.inviteRequest.push(invite)
      await userTo.save()
      const inviteRes = await User.findById(userId).populate('inviteRequest.from inviteRequest.group')

      // Pick user from
      const userFrom: any = await User.findById(from)

      const request = {
        to: userTo,
        group: isGroup
      }

      userFrom.acceptRequest.push(request)
      await userFrom.save()

      return res.status(200).json(responseWithToken(inviteRes, newToken))
    } catch (error) {
      console.log(error.message)
      return res.status(500).json(serverError())
    }
  }

  public async acceptRequest (req: Request, res: Response): Promise<Response> {
    try {
      const { body, newToken, userId } = req
      const { to, group } = body

      req.body = cleanFields(body)

      const requiredFields = ['to', 'group']
      if (!isValidFields(requiredFields, body)) {
        return res.status(400).json(responseWithToken(missingParamError(), newToken))
      }

      // Valid object id
      if (!validObjectId(to)) {
        return res.status(400).json(responseWithToken(notFound('Convite'), newToken))
      }

      const isTo = await User.findById(to)
      if (!isTo) {
        return res.status(400).json(responseWithToken(notFound('Convite'), newToken))
      }

      const isGroup: any = await Groups.findById(group)
      if (!isGroup) {
        return res.status(400).json(responseWithToken(notFound('Convite'), newToken))
      }

      // Pick user to valid if accept request exist
      const user = await User.findById(userId)

      if (!await User.findOne({ _id: userId, 'acceptRequest.to': to, 'acceptRequest.group': group })) {
        return res.status(404).json(responseWithToken(notFound('Convite'), newToken))
      }

      // Pick To to valid if invite request exist
      if (!await User.findOne({ _id: to, 'inviteRequest.from': userId, 'inviteRequest.group': group })) {
        return res.status(404).json(responseWithToken(notFound('Convite'), newToken))
      }

      // add member by the group
      if (await Groups.findOne({ members: userId })) {
        return res.status(400).json(responseWithToken('Usuário ja esta no grupo', newToken))
      }
      isGroup.members.push(user)
      await isGroup.save()

      // remove inviteRequest
      isTo?.inviteRequest?.splice(
        isTo?.inviteRequest?.map(invite => invite.from && invite.group).indexOf(user?._id, isGroup._id)
      )
      await isTo.save()

      // remove acceptRequest
      user?.acceptRequest?.splice(
        user?.acceptRequest?.map(accept => accept.to && accept.group).indexOf(to, isGroup._id)
      )
      await user?.save()

      return res.status(200).json(responseWithToken(null, newToken))
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const { body, newToken, file, params } = req
    const { title, description } = body
    const { id } = params
    try {
      req.body = cleanFields(body)

      const lastGroup = await Groups.findById(id)

      const fieldsGroup: any = lastGroup

      if (title && !await Groups.findOne({ title })) {
        fieldsGroup.title = title
      } else {
        return res.status(400).json(responseWithToken(fieldInUse('Titulo'), newToken))
      }

      if (description) fieldsGroup.description = description

      if (file) {
        // Delete last image if exists
        if (fieldsGroup.image) {
          awsS3DeleteImage(fieldsGroup.image.key)
        }

        const image: {
          name?: string
          size?: Number
          key?: string
          url?: string
        } = {}

        if (file.originalname) image.name = file.originalname
        if (file.size) image.size = file.size
        if (file.key) image.key = file.key
        if (file.location) image.url = file.location

        fieldsGroup.image = image
      }

      const group = await Groups.findByIdAndUpdate({
        _id: id
      }, {
        $set: fieldsGroup
      }, {
        upsert: true
      })

      return res.status(200).json(responseWithToken(group, newToken))
    } catch (error) {
      if (file) {
        awsS3DeleteImage(file.key)
      }
      return res.status(500).json(serverError())
    }
  }

  public async logoutGroup (req: Request, res: Response): Promise<Response> {
    try {
      const { params, userId, newToken } = req
      const { id } = params

      const group = await Groups.findById(id)

      if (!group) {
        return res.status(404).json(responseWithToken(notFound('Grupo'), newToken))
      }

      if (typeof group.members === 'object') {
        group?.members?.splice(
          group?.members?.map(member => member._id).indexOf(userId)
          )
      }

      if (typeof group.administrators === 'object') {
          group?.administrators?.splice(
            group?.administrators?.map(member => member._id).indexOf(userId)
            )
      }

      await group?.save()

      return res.status(200).json(responseWithToken('Saiu do grupo com sucesso', newToken))
    } catch (error) {
      console.log(error.message)
      return res.status(500).json(serverError())
    }
  }

  public async removeParticipantGroup (req: Request, res: Response): Promise<Response> {
    try {
      const { params, newToken } = req
      const { id, idParticipant } = params

      const group = await Groups.findById(id)

      if (!group) {
        return res.status(404).json(responseWithToken(notFound('Grupo'), newToken))
      }

      if (typeof group.members === 'object') {
        group?.members?.splice(
          group?.members?.map(member => member._id).indexOf(idParticipant)
          )
      }

      if (typeof group.administrators === 'object') {
          group?.administrators?.splice(
            group?.administrators?.map(member => member._id).indexOf(idParticipant)
            )
      }

      await group?.save()

      return res.status(200).json(responseWithToken('Removido do grupo com sucesso', newToken))
    } catch (error) {
      console.log(error.message)
      return res.status(500).json(serverError())
    }
  }

  public async destroy (req: Request, res: Response): Promise<Response> {
    try {
      const { params, newToken } = req
      const { id } = params

      if (!id) {
        res.status(400).json(responseWithToken(notFound('Id'), newToken))
      }

      const usersAccepts = await User.find({ 'acceptRequest.group': id })

      const idGroup: any = id
      if (usersAccepts) {
        usersAccepts.map(async user => {
          user?.acceptRequest?.splice(
            user?.acceptRequest?.map(accept => accept.group).indexOf(idGroup)
            )
          await User.findByIdAndUpdate({
            _id: user.id
          }, {
            $set: user
          }, {
            upsert: true
          })
        })
      }

      const usersRequests = await User.find({ 'inviteRequest.group': id })

      if (usersRequests) {
        usersRequests.map(async user => {
          user?.inviteRequest?.splice(
            user?.inviteRequest?.map(request => request.group).indexOf(idGroup)
            )
          await User.findByIdAndUpdate({
            _id: user.id
          }, {
            $set: user
          }, {
            upsert: true
          })
        })
      }

      await Groups.findByIdAndDelete(id)

      return res.status(200).json(responseWithToken(deleteSuccess(), newToken))
    } catch (error) {
      console.log(error.message)
      return res.status(500).json(serverError())
    }
  }
}

export default new GroupsController()
