import { Request, Response } from 'express'
import { compare } from 'bcrypt'
import { User } from '../models'
import { generateToken, isValidFields, cleanFields } from '../../utils'

class AuthController {
  public async login (req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req
      const { email, password } = body

      req.body = cleanFields(body)

      const requiredFields = ['email', 'password']
      if (!isValidFields(requiredFields, body)) {
        return res.status(400).json('Campo em branco')
      }

      const user = await User.findOne({ email }).select('+password')

      if (!user || !await compare(password, user.password)) {
        return res.status(400).json('Usário ou senha incorreto')
      }

      Object.assign({}, user, { password: undefined })

      return res.status(200).json({ user, token: generateToken(user.id) })
    } catch (error) {
      return res.status(500).json('Server Error')
    }
  }

  public async loadUser (req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findById(req.userId)

      return res.status(200).json(user)
    } catch (error) {
      return res.status(500).json('Server Error')
    }
  }
}

export default new AuthController()
