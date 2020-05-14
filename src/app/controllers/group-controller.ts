import { Request, Response } from 'express'
import { Groups, User } from '../models'
import { isValidFields, cleanFields } from '../../utils'
import { serverError, missingParamError, fieldInUse, notFound } from '../errors'
import { responseWithToken } from '../helpers'
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

      return res.status(200).json({ body: groups })
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
        return res.status(400).json(missingParamError())
      }

      if (await Groups.findOne({ title: body.title })) {
        return res.status(400).json(fieldInUse('Nome do grupo'))
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

      if (!group) return res.status(400).json(notFound('Grupo'))

      return res.status(200).json({ body: group })
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
        return res.status(400).json(missingParamError())
      }

      // Valid object id from
      if (!validObjectId(from)) {
        return res.status(400).json(notFound('Convite'))
      }

      const isFrom = await User.findById(from)
      if (!isFrom) {
        return res.status(400).json(notFound('Convite'))
      }

      const isGroup = await Groups.findById(group)
      if (!isGroup) {
        return res.status(400).json(notFound('Convite'))
      }

      // Pick user to
      const userTo: any = await User.findById(userId)

      // if repeat invite
      for (const invite of userTo.inviteRequest) {
        if (invite.from == from && invite.group == group) {
          return res.status(400).json('Convite já existe')
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
        return res.status(400).json(missingParamError())
      }

      // Valid object id from
      if (!validObjectId(to)) {
        return res.status(400).json(notFound('Convite'))
      }

      const isTo = await User.findById(to)
      if (!isTo) {
        return res.status(400).json(notFound('Convite'))
      }

      const isGroup: any = await Groups.findById(group)
      if (!isGroup) {
        return res.status(400).json(notFound('Convite'))
      }

      // Pick user to valid if accept request exist
      const user = await User.findById(userId)

      if (user?.acceptRequest) {
        for (const accept of user.acceptRequest) {
          if (accept.to !== to) {
            return res.status(404).json(notFound('Convite'))
          }
        }
      }

      await isGroup.members.push(user)
      isGroup.save()

      // deletar o invite do convite
      // deletar o received do convite

      return res.status(200).json(responseWithToken(null, newToken))
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }
}

export default new GroupsController()
