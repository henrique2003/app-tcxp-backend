import { Request, Response, NextFunction } from 'express'
import { Groups } from '../models'
import { serverError, notFound } from '../errors'
import { validObjectId } from '../helpers/valid-object-id'
import { responseWithToken } from '../helpers'

export const isInGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params, body, userId, newToken } = req
    const { group } = body
    const { id } = params

    const idGroup = group || id

    if (!validObjectId(idGroup)) {
      return res.status(404).json(responseWithToken(notFound('Grupo'), newToken))
    }

    if (!await Groups.findOne({ _id: idGroup, creator: userId })) {
      if (!await Groups.findOne({ _id: idGroup, administrator: userId })) {
        if (!await Groups.findOne({ _id: idGroup, members: userId })) {
          return res.status(404).json(responseWithToken(notFound('Grupo'), newToken))
        }
      }
    }

    next()
  } catch (error) {
    return res.status(500).json(serverError())
  }
}
