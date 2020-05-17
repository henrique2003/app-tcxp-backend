import { Request, Response, NextFunction } from 'express'
import { Groups } from '../models'
import { serverError, notFound } from '../errors'
import { validObjectId } from '../helpers/valid-object-id'
import { responseWithToken } from '../helpers'

export const isInGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body, userId, newToken } = req
    const { group } = body

    if (!validObjectId(group)) {
      return res.status(404).json(responseWithToken(notFound('Convite'), newToken))
    }

    if (!await Groups.findOne({ _id: group, creator: userId })) {
      if (!await Groups.findOne({ _id: group, administrator: userId })) {
        if (!await Groups.findOne({ _id: group, members: userId })) {
          return res.status(404).json(responseWithToken(notFound('Convite'), newToken))
        }
      }
    }

    next()
  } catch (error) {
    return res.status(500).json(serverError())
  }
}
