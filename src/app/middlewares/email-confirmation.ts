import { Request, Response, NextFunction } from 'express'
import { User } from '../models'
import { serverError } from '../errors'
import { responseWithToken } from '../helpers'

export const emailConfirmation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { newToken } = req

    if (!await User.findOne({ _id: req.userId, emailConfirmation: true })) {
      return res.status(401).json(responseWithToken('Necessário comfirmar email', newToken))
    }

    next()
  } catch (error) {
    return res.status(500).json(serverError())
  }
}
