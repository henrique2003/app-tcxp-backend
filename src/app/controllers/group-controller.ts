import { Request, Response } from 'express'
import { Groups, User } from '../models'
import { isValidFields, cleanFields } from '../../utils'
import { serverError, missingParamError, fieldInUse, notFound } from '../Errors'

class GroupsController {
  public async index (req: Request, res: Response): Promise<Response> {
    try {
      const { page = 1 } = req.query

      const options = {
        perPage: page,
        populate: 'creator administrators members',
        limit: 10
      }

      const groups = await Groups.paginate({ completed: true }, options)

      return res.status(200).json(groups)
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }

  public async mine (req: Request, res: Response): Promise<Response> {
    try {
      const id = req.userId

      const creatorGroup = await Groups.find({ creator: id })
      const adminGroup = await Groups.find({ administrators: id })
      const memberGroup = await Groups.find({ members: id })

      const groups = { creatorGroup, adminGroup, memberGroup }

      return res.status(200).json(groups)
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }

  public async store (req: Request, res: Response): Promise<Response> {
    try {
      const { body, userId } = req
      req.body = cleanFields(body)

      const requiredFields = ['title', 'description']
      if (!isValidFields(requiredFields, body)) {
        return res.status(400).json(missingParamError())
      }

      if (await Groups.findOne({ title: body.title })) {
        return res.status(400).json(fieldInUse('Nome do grupo'))
      }

      body.creator = await User.findById(userId)

      const groups = await Groups.create(body)

      return res.status(200).json(groups)
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }

  public async show (req: Request, res: Response): Promise<Response> {
    try {
      const group = await Groups.findById(req.params.id).populate('creator administrators members')

      if (!group) return res.status(400).json(notFound('Grupo'))

      return res.status(200).json(group)
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }
}

export default new GroupsController()
