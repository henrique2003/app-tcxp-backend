import { Request, Response } from 'express'
import { Groups, User } from '../models'
import { isValidFields, cleanFields } from '../../utils'
import { serverError, missingParamError, fieldInUse, notFound } from '../errors'
import { responseWithToken } from '../helpers'

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

  public async invite (req: Request, res: Response): Promise<Response> {
    try {
      const { body, newToken } = req
      const { from } = body

      req.body = cleanFields(body)

      const requiredFields = ['from', 'group']
      if (!isValidFields(requiredFields, body)) {
        return res.status(400).json(missingParamError())
      }

      // Valid object ids
      if (from.length !== 24) {
        return res.status(404).json(notFound('Destinatário'))
      }

      const isFrom = await User.findById(from)
      if (!isFrom) {
        return res.status(404).json(notFound('Destinatário'))
      }

      // const isGroup = await Groups.findById(group)
      // if (!isGroup) {
      //   return res.status(404).json(notFound('Grupo'))
      // }

      // // Pick user
      // const userTo = await User.findById(userId)
      // console.log(userTo)
      // const invite = {
      //   to: userTo,
      //   from: isFrom,
      //   group: isGroup
      // }

      // userTo.invitesRequest.push(invite)

      // const inviteRes = await userTo.save()
      // invitar na propria pessoa que mandar o convite
      // por na request da pessoa que recebe o convite

      return res.status(200).json(responseWithToken(isFrom, newToken))
    } catch (error) {
      console.error(error.message)
      return res.status(500).json(serverError())
    }
  }
}

export default new GroupsController()
