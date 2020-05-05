import { Request, Response, NextFunction } from 'express'
import { User } from '../models'
import { serverError } from '../Errors'

export const emailConfirmation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!await User.findOne({ _id: req.userId, emailConfirmation: true })) {
      return res.status(401).json('Necessário comfirmar email')
    }

    next()
  } catch (error) {
    return res.status(500).json(serverError)
  }
}
