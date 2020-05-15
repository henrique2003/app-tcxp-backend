import { Request, Response, NextFunction } from 'express'
import { Groups } from '../models'
import { serverError, notFound } from '../errors'

export const isMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params, userId } = req

    if (!params.id) {
      return res.status(400).json(notFound('Id'))
    }

    if (!await Groups.findOne({ _id: params.id, members: userId })) {
      return res.status(401).json('Acesso negado')
    }

    return next()
  } catch (error) {
    return res.status(500).json(serverError())
  }
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params, userId } = req

    if (!params.id) {
      return res.status(400).json(notFound('Id'))
    }

    if (!await Groups.findOne({ _id: params.id, administrators: userId })) {
      return res.status(401).json('Acesso negado')
    }

    return next()
  } catch (error) {
    return res.status(500).json(serverError())
  }
}

export const isCreator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params, userId } = req

    if (!params.id) {
      return res.status(400).json(notFound('Id'))
    }

    if (!await Groups.findOne({ _id: params.id, creator: userId })) {
      return res.status(401).json('Acesso negado')
    }

    return next()
  } catch (error) {
    return res.status(500).json(serverError())
  }
}
