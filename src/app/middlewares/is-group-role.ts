import { Request, Response, NextFunction } from 'express'
import { Groups } from '../models'
import { serverError, notFound } from '../errors'
import { responseWithToken } from '../helpers'

export const isMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params, userId, newToken } = req

    if (!params.id) {
      return res.status(400).json(responseWithToken(notFound('Id'), newToken))
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
    const { params, userId, newToken } = req

    if (!params.id) {
      return res.status(400).json(responseWithToken(notFound('Id'), newToken))
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
    const { params, userId, newToken } = req

    if (!params.id) {
      return res.status(400).json(responseWithToken(notFound('Id'), newToken))
    }

    if (!await Groups.findOne({ _id: params.id, creator: userId })) {
      return res.status(401).json('Acesso negado')
    }

    return next()
  } catch (error) {
    return res.status(500).json(serverError())
  }
}

export const isCreatorOrAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params, userId, newToken } = req
    const { id } = params

    if (!params.id) {
      return res.status(400).json(responseWithToken(notFound('Id'), newToken))
    }

    if (!await Groups.findOne({ _id: id, creator: userId })) {
      if (!await Groups.findOne({ _id: id, administrators: userId })) {
        return res.status(401).json('Acesso negado')
      }
    }

    return next()
  } catch (error) {
    return res.status(500).json(serverError())
  }
}
