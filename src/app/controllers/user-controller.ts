import UserInterface from '../models/user/protocols'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import validator from 'validator'
import { User } from '../models'
import { generateToken, isValidFields, cleanFields, titleize } from '../../utils'

class UserController {
  public async index (req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).json(await User.find())
    } catch (error) {
      return res.status(500).json('Server error')
    }
  }

  public async store (req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req
      const { password, email } = body

      // Clean fields
      req.body = cleanFields(body)

      // Verify if fields exists
      const requiredFields = ['name', 'password', 'passwordConfirmation', 'email']
      if (!isValidFields(requiredFields, body)) {
        return res.status(400).json('Campos em branco')
      }

      // Valid if is a email
      if (!validator.isEmail(email)) {
        return res.status(400).json('Email inválido')
      }

      // Valid id email alredy in use
      if (await User.findOne({ email })) {
        return res.status(400).json('Email em uso')
      }

      // Put the first letter of name in capital
      body.name = titleize(body.name)

      // Encrip password
      body.password = await bcrypt.hash(password, 10)

      // Create new user
      const user: UserInterface = await User.create(req.body)

      // Generate a new token
      const token = generateToken(user.id)

      return res.status(200).json({ user, token })
    } catch (error) {
      return res.status(500).json('Server Error')
    }
  }

  public async update (req: Request, res: Response): Promise<Response> {
    try {
      const { password } = req.body

      req.body = cleanFields(req.body)

      const lastUser = await User.findById(req.userId)

      if (!lastUser) {
        return res.status(400).json('Usuário não encontrado')
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
        if (field) fieldUser[field] = req.body[field]
      }

      if (password) lastUser.password = await bcrypt.hash(password, 10)

      const user: UserInterface = await lastUser.save()

      return res.status(200).json(user)
    } catch (error) {
      return res.status(500).json('Server Error')
    }
  }

  public async show (req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      if (!id) return res.status(400).json('Id requerido')

      const user = await User.findById(id)

      if (!user) return res.status(400).json('Usuário não encontrado')

      return res.status(200).json(user)
    } catch (error) {
      return res.status(500).json('Server Error')
    }
  }

  public async destroy (req: Request, res: Response): Promise<Response> {
    try {
      await User.findByIdAndDelete(req.userId)

      return res.status(200).json('Deletado com sucesso')
    } catch (error) {
      return res.status(500).json('Server Error')
    }
  }
}

export default new UserController()
