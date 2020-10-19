import { Request, Response } from 'express'
import { compare } from 'bcrypt'
import { User } from '../models'
import { isValidFields, cleanFields } from '../../utils'
import { serverError, missingParamError } from '../errors'
import { generateToken, responseWithToken } from '../helpers'

class AuthController {
  public async login (req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req
      const { email, password } = body

      req.body = cleanFields(body)

      const requiredFields = ['email', 'password']
      if (!isValidFields(requiredFields, body)) {
        return res.status(400).json(missingParamError())
      }

      const user = await User.findOne({ email }).select('+password')

      if (!user || !await compare(password, user.password)) {
        return res.status(400).json('Usário ou senha incorreto')
      }

      Object.assign({}, user, { password: undefined })

      return res.status(200).json(responseWithToken(user, generateToken(user.id)))
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }

  public async loadUser (req: Request, res: Response): Promise<Response> {
    try {
      const { userId, newToken } = req
      const user = await User.findById(userId).populate('avaliate.user acceptRequest.to acceptRequest.group')

      return res.status(200).json(responseWithToken(user, newToken))
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }
}

export default new AuthController()
