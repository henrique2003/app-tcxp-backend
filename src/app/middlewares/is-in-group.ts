import { Request, Response, NextFunction } from 'express'
import { Groups } from '../models'
import { serverError, notFound } from '../errors'

export const isInGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body, userId } = req
    const { group } = body

    if (group.length !== 24) {
      return res.status(404).json(notFound('Convite'))
    }

    if (!await Groups.findOne({ _id: group, creator: userId })) {
      if (!await Groups.findOne({ _id: group, administrator: userId })) {
        if (!await Groups.findOne({ _id: group, members: userId })) {
          return res.status(404).json('Convite Não encontrado')
        }
      }
    }

    next()
  } catch (error) {
    return res.status(500).json(serverError())
  }
}