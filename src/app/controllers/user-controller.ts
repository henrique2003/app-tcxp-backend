import { hash } from 'bcrypt'
import { randomBytes } from 'crypto'
import validator from 'validator'
import { Request, Response } from 'express'
import { User } from '../models'
import { isValidFields, cleanFields, titleize } from '../../utils'
import { generateToken, responseWithToken, emailConfirmation, forgotPassword } from '../helpers'
import { missingParamError, invalidFieldError, fieldInUse, serverError, notFound, deleteSuccess } from '../errors'
import configs from '../../config/config'

class UserController {
  public async store (req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req
      const { password, email, name, passwordConfirmation } = body

      // Clean fields
      req.body = cleanFields(body)

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

      // Email confirmation
      const expires = new Date()
      req.body.emailConfirmationCode = randomBytes(10).toString('hex')
      req.body.emailConfirmationExpire = expires.setHours(expires.getHours() + 1)

      // Create new user
      const user = await User.create(body)

      // Invite email
      if (!await emailConfirmation(user)) {
        return res.status(500).json('Erro ao enviar email de confirmação')
      }

      // Generate a new token
      const token = generateToken(user.id)

      return res.status(200).json(responseWithToken(user, token))
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const { body, userId, newToken, file } = req
    const { password, passwordConfirmation, email, rememberMe } = body

    try {
      req.body = cleanFields(body)

      const lastUser = await User.findById(userId)

      if (!lastUser) {
        return res.status(400).json(notFound('Usuário'))
      }

      if (email) {
        // Valid if is a email
        if (!validator.isEmail(email)) {
          return res.status(400).json(invalidFieldError('email'))
        }

        // Valid id email alredy in use
        if (await User.findOne({ email })) {
          return res.status(400).json(fieldInUse('email'))
        }
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
      const fieldsUser: any = lastUser
      for (const field of validFields) {
        if (field) fieldsUser[field] = body[field]
      }

      // Valid passwordConfirmation
      if (password) {
        if (password !== passwordConfirmation) {
          return res.status(400).json(invalidFieldError('confirmar email'))
        } else {
          lastUser.password = await hash(password, 10)
        }
      }

      if (rememberMe) fieldsUser.rememberMe = true
      else fieldsUser.rememberMe = false

      // Upload image
      if (file) {
        // Delete last image if exists
        if (fieldsUser.imageProfile) {
          const s3 = configs.s3
          s3.deleteObject({
            Bucket: configs.aws_bucket,
            Key: fieldsUser.imageProfile.key
          }).promise()
        }
        if (file.originalname) fieldsUser.imageProfile.name = file.originalname
        if (file.size) fieldsUser.imageProfile.size = file.size
        if (file.key) fieldsUser.imageProfile.key = file.key
        if (file.location) fieldsUser.imageProfile.url = file.location
      }

      const user = await User.findByIdAndUpdate({
        _id: userId
      }, {
        $set: fieldsUser
      }, {
        upsert: true
      })

      return res.status(200).json(responseWithToken(user, newToken))
    } catch (error) {
      if (file) {
        const s3 = configs.s3
        s3.deleteObject({
          Bucket: configs.aws_bucket,
          Key: file.key
        }).promise()
      }
      return res.status(500).json(serverError())
    }
  }

  public async show (req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      if (!id) return res.status(400).json('Id requerido')

      const user = await User.findById(id)

      if (!user) return res.status(400).json(notFound('Usuário'))

      return res.status(200).json(responseWithToken(user))
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }

  public async destroy (req: Request, res: Response): Promise<Response> {
    try {
      const id = req.userId

      const user = await User.findById(id)

      if (user?.imageProfile) {
        const s3 = configs.s3
        s3.deleteObject({
          Bucket: configs.aws_bucket,
          Key: user.imageProfile.key
        }).promise()
      }

      await User.findByIdAndDelete(id)

      return res.status(200).json(responseWithToken(deleteSuccess()))
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }

  public async emailConfirmation (req: Request, res: Response): Promise<Response> {
    try {
      const { userId, newToken } = req
      const id = userId

      const user: any = await User.findById(id).select('+emailConfirmationExpire emailConfirmationCode')

      if (!user) {
        return res.status(404).json(notFound('Usuário'))
      }

      const { emailConfirmationExpire, emailConfirmationCode } = user

      const now = new Date()
      if (now > emailConfirmationExpire) {
        return res.status(400).json('O código expirou')
      }

      if (req.body.emailConfirmationCode !== emailConfirmationCode) {
        return res.status(400).json('Código inválido')
      }

      user.emailConfirmation = true

      await user.save()
      const resUser = await User.findById(id)

      return res.status(200).json(responseWithToken(resUser, newToken))
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }

  public async emailConfirmationResend (req: Request, res: Response): Promise<Response> {
    try {
      const { userId, newToken } = req
      const id = userId

      const user = await User.findById(id)

      if (!user) {
        return res.status(404).json(notFound('Usuário'))
      }

      // Put the first letter of name in capital ans encrip password
      user.emailConfirmationCode = randomBytes(10).toString('hex')
      const expires = new Date()
      user.emailConfirmationExpire = expires.setHours(expires.getHours() + 1)

      // Invite email
      if (!emailConfirmation(user)) {
        return res.status(500).json('Erro ao enviar email de confirmação')
      }

      await user.save()

      return res.status(200).json(responseWithToken('Email reenviado com sucesso', newToken))
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }

  public async forgotPassword (req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body

      const user = await User.findOne({ email })

      if (!user) {
        return res.status(404).json(notFound('Usuário'))
      }

      const expires = new Date()
      user.forgotPasswordExpire = expires.setHours(expires.getHours() + 1)
      user.forgotPasswordToken = randomBytes(20).toString('hex')

      await user.save()

      // Invite email
      forgotPassword(user)

      return res.status(200).json(responseWithToken('Um email foi enviado para você!'))
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }

  public async forgotPasswordConfirm (req: Request, res: Response): Promise<Response> {
    try {
      const { token, password, passwordConfirmation } = req.body

      const user: any = await User.findOne({ forgotPasswordToken: token }).select('+forgotPasswordExpire forgotPasswordToken')

      if (!user) {
        return res.status(404).json(notFound('Token de autenticação'))
      }

      const { forgotPasswordToken, forgotPasswordExpire } = user

      const now = new Date()
      if (now > forgotPasswordExpire) {
        return res.status(400).json('O código expirou')
      }

      if (token !== forgotPasswordToken) {
        return res.status(400).json('Código inválido')
      }

      if (!password) {
        return res.status(400).json(missingParamError('senha'))
      }

      if (password !== passwordConfirmation) {
        return res.status(400).json(invalidFieldError('confirmar senha'))
      }

      user.password = await hash(password, 10)
      user.forgotPasswordToken = null

      const resUser = await User.findByIdAndUpdate({
        _id: user.id
      }, {
        $set: user
      }, {
        upsert: true
      })

      return res.status(200).json(responseWithToken(resUser))
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }
}

export default new UserController()
