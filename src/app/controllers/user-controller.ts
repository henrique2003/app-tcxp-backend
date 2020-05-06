import { hash } from 'bcrypt'
import validator from 'validator'
import UserInterface from '../models/user/protocols'
import { Request, Response } from 'express'
import { User } from '../models'
import { isValidFields, cleanFields, titleize } from '../../utils'
import { generateToken, responseWithToken } from '../helpers'
import { missingParamError, invalidFieldError, fieldInUse, serverError, notFound, deleteSuccess } from '../errors'

class UserController {
  public async store (req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req
      const { password, email, name, passwordConfirmation } = body

      // Clean fields
      req.body = cleanFields({ name, email, password, passwordConfirmation })

      // Verify if fields exists
      const requiredFields = ['name', 'password', 'passwordConfirmation', 'email']
      if (!isValidFields(requiredFields, body)) {
        return res.status(400).json(missingParamError())
      }

      // Valid passwordConfirmation
      if (password !== passwordConfirmation) {
        return res.status(400).json(invalidFieldError('confirmar email'))
      }

      // Valid if is a email
      if (!validator.isEmail(email)) {
        return res.status(400).json(invalidFieldError('email'))
      }

      // Valid id email alredy in use
      if (await User.findOne({ email })) {
        return res.status(400).json(fieldInUse('email'))
      }

      // Put the first letter of name in capital ans encrip password
      const hashPassword = await hash(password, 10)
      req.body = Object.assign(body, { name: titleize(name), password: hashPassword })

      // Create new user
      const user: UserInterface = await User.create(body)

      // Generate a new token
      const token = generateToken(user.id)

      return res.status(200).json({ user, token })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json(serverError())
    }
  }

  public async update (req: Request, res: Response): Promise<Response> {
    try {
      const { body, userId, newToken } = req
      const { password } = body

      req.body = cleanFields(body)

      const lastUser = await User.findById(userId)

      if (!lastUser) {
        return res.status(400).json(notFound('Usuário'))
      }

      const validFields = [
        'name',
        'email',
        'city',
        'state',
        'country',
        'celphone',
        'facebook',
        'instagram',
        'twitter'
      ]

      for (const field of validFields) {
        const fieldUser: any = lastUser
        if (field) fieldUser[field] = body[field]
      }

      if (password) lastUser.password = await hash(password, 10)

      const user: UserInterface = await lastUser.save()

      return res.status(200).json(responseWithToken(user, newToken))
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }

  public async show (req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      if (!id) return res.status(400).json('Id requerido')

      const user = await User.findById(id)

      if (!user) return res.status(400).json(notFound('Usuário'))

      return res.status(200).json(user)
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }

  public async destroy (req: Request, res: Response): Promise<Response> {
    try {
      await User.findByIdAndDelete(req.userId)

      return res.status(200).json(deleteSuccess())
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }
}

export default new UserController()
