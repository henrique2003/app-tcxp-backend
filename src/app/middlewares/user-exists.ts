import { Request, Response, NextFunction } from 'express'
import { User } from '../models'

export const userExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.userId

    if (!await User.findById(id)) {
      return res.status(400).json('Usuário não encontrado')
    }

    next()
  } catch (error) {
    return res.status(500).json('Server Error')
  }
}
