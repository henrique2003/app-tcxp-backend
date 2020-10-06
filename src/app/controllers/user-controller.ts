import { hash } from 'bcrypt'
import { randomBytes } from 'crypto'
import validator from 'validator'
import { Request, Response } from 'express'
import { User } from '../models'
import { isValidFields, cleanFields, titleize } from '../../utils'
import {
  generateToken,
  responseWithToken,
  emailConfirmation,
  forgotPassword,
  awsS3DeleteImage,
  validObjectId
} from '../helpers'

import {
  missingParamError,
  invalidFieldError,
  fieldInUse,
  serverError,
  notFound,
  deleteSuccess,
  expiresCode,
  invalidCode,
  inviteEmailError
} from '../errors'

class UserController {
  public async index (req: Request, res: Response): Promise<Response> {
    try {
      const { page = 1 } = req.query

      const options = {
        perPage: page,
        limit: 10
      }

      const user = await User.paginate({}, options)

      return res.status(200).json(responseWithToken(user))
    } catch (error) {
      console.log(error.message)
      return res.status(500).json(serverError())
    }
  }

  public async store (req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req
      const { password, email, name, passwordConfirmation } = body

      // Clean fields
      req.body = cleanFields(body)

      // Verify if fields exists
      const requiredFields = ['name', 'password', 'passwordConfirmation', 'email']
      if (!isValidFields(requiredFields, body)) {
        return res.status(400).json(responseWithToken(missingParamError()))
      }

      // Valid passwordConfirmation
      if (password !== passwordConfirmation) {
        return res.status(400).json(responseWithToken(invalidFieldError('confirmar email')))
      }

      // Valid if is a email
      if (!validator.isEmail(email)) {
        return res.status(400).json(responseWithToken(invalidFieldError('email')))
      }

      // Valid id email alredy in use
      if (await User.findOne({ email })) {
        return res.status(400).json(responseWithToken(fieldInUse('email')))
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
        return res.status(500).json(responseWithToken(inviteEmailError('confirmação')))
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
    const { password, passwordConfirmation, email, rememberMe, interestings } = body

    try {
      req.body = cleanFields(body)

      const lastUser = await User.findById(userId)

      if (!lastUser) {
        return res.status(400).json(responseWithToken(notFound('Usuário'), newToken))
      }

      if (email) {
        // Valid if is a email
        if (!validator.isEmail(email)) {
          return res.status(400).json(responseWithToken(invalidFieldError('email'), newToken))
        }

        // Valid id email alredy in use
        if (await User.findOne({ email })) {
          return res.status(400).json(responseWithToken(fieldInUse('Email'), newToken))
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
        'twitter',
        'description'
      ]

      const fieldsUser: any = lastUser
      const { imageProfile } = fieldsUser

      for (const field of validFields) {
        if (field) fieldsUser[field] = body[field]
      }

      // Valid passwordConfirmation
      if (password) {
        if (password !== passwordConfirmation) {
          return res.status(400).json(responseWithToken(invalidFieldError('confirmar senha'), newToken))
        } else {
          lastUser.password = await hash(password, 10)
        }
      }

      // Interestings
      if (interestings) {
        let newInterestings: string[] = interestings.split(',')

        newInterestings = newInterestings.map(interesting => {
          return interesting.trim()
        })

        fieldsUser.interestings = newInterestings
      }

      if (rememberMe) fieldsUser.rememberMe = true
      else fieldsUser.rememberMe = false

      // Upload image
      if (file) {
        const { key, originalname, size, location } = file
        // Delete last image if exists
        if (imageProfile) {
          awsS3DeleteImage(imageProfile.key)
        }

        if (originalname) imageProfile.name = originalname
        if (size) imageProfile.size = size
        if (key) imageProfile.key = key
        if (location) imageProfile.url = location
      }

      const user = await User.findByIdAndUpdate({
        _id: userId
      }, {
        $set: fieldsUser
      }, {
        upsert: true
      })

      if (user) {
        if (fieldsUser.name) user.name = fieldsUser.name
        if (fieldsUser.email) user.email = fieldsUser.email
        if (fieldsUser.description) user.description = fieldsUser.description
        if (fieldsUser.city) user.city = fieldsUser.city
        if (fieldsUser.state) user.state = fieldsUser.state
        if (fieldsUser.country) user.country = fieldsUser.country
        if (fieldsUser.celphone) user.celphone = fieldsUser.celphone
        if (fieldsUser.facebook) user.facebook = fieldsUser.facebook
        if (fieldsUser.instagram) user.instagram = fieldsUser.instagram
        if (fieldsUser.twitter) user.twitter = fieldsUser.twitter
        if (file) {
          user.imageProfile.size = fieldsUser.imageProfile.size
          user.imageProfile.name = fieldsUser.imageProfile.originalname
          user.imageProfile.key = fieldsUser.imageProfile.key
          user.imageProfile.url = fieldsUser.imageProfile.url
        }
      }

      return res.status(200).json(responseWithToken(user, newToken))
    } catch (error) {
      if (file) {
        awsS3DeleteImage(file.key)
      }

      console.log(error.message)
      return res.status(500).json(serverError())
    }
  }

  public async show (req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      if (!id) return res.status(400).json(responseWithToken(notFound('id')))

      const user = await User.findById(id)

      if (!user) return res.status(400).json(responseWithToken(notFound('Usuário')))

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
        awsS3DeleteImage(user.imageProfile.key)
      }

      await User.findByIdAndDelete(id)

      return res.status(200).json(responseWithToken(deleteSuccess()))
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }

  public async emailConfirmation (req: Request, res: Response): Promise<Response> {
    try {
      const { userId: id, newToken } = req

      const user: any = await User.findById(id).select('+emailConfirmationExpire emailConfirmationCode')

      if (!user) {
        return res.status(404).json(responseWithToken(notFound('Usuário'), newToken))
      }

      const { emailConfirmationExpire, emailConfirmationCode } = user

      const now = new Date()
      if (now > emailConfirmationExpire) {
        return res.status(400).json(responseWithToken(expiresCode(), newToken))
      }

      if (req.body.emailConfirmationCode !== emailConfirmationCode) {
        return res.status(400).json(responseWithToken(invalidCode(), newToken))
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
        return res.status(404).json(responseWithToken(notFound('Usuário'), newToken))
      }

      // Put the first letter of name in capital ans encrip password
      user.emailConfirmationCode = randomBytes(10).toString('hex')
      const expires = new Date()
      user.emailConfirmationExpire = expires.setHours(expires.getHours() + 1)

      // Invite email
      if (!emailConfirmation(user)) {
        return res.status(500).json(responseWithToken(inviteEmailError('confirmação'), newToken))
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
        return res.status(404).json(responseWithToken(notFound('Usuário')))
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
        return res.status(404).json(responseWithToken(notFound('Token de autenticação')))
      }

      const { forgotPasswordToken, forgotPasswordExpire } = user

      const now = new Date()
      if (now > forgotPasswordExpire) {
        return res.status(400).json(responseWithToken(expiresCode()))
      }

      if (token !== forgotPasswordToken) {
        return res.status(400).json(responseWithToken(invalidCode()))
      }

      if (!password) {
        return res.status(400).json(responseWithToken(missingParamError('senha')))
      }

      if (password !== passwordConfirmation) {
        return res.status(400).json(responseWithToken(invalidFieldError('confirmar senha')))
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

  public async avaliate (req: Request, res: Response): Promise<Response> {
    try {
      const { body, newToken, userId, params } = req
      const { avaliate } = body
      const { id } = params

      if (!id || !validObjectId(id)) {
        return res.status(400).json(responseWithToken(notFound('Id'), newToken))
      }

      const user = await User.findById(id)

      if (!user) {
        return res.status(400).json(responseWithToken(notFound('User'), newToken))
      }

      if (user._id == userId) {
        return res.status(401).json(responseWithToken('Você não pode se auto avaliar', newToken))
      }

      let ifRepeatAvaliate = false
      if (user?.avaliate.length !== 0) {
        user?.avaliate.map((avaliate) => {
          if (avaliate.user == userId) {
            ifRepeatAvaliate = true
          }
        })
      }

      if (ifRepeatAvaliate) {
        return res.status(400).json(responseWithToken('Você ja avaliou está pessoa', newToken))
      }

      user?.avaliate.push({
        user: userId,
        avaliate
      })

      let avaliations = 0
      for (const avaliation of user?.avaliate) {
        avaliations = avaliations + avaliation.avaliate
      }

      if (user.avaliate.length !== 0) {
        user.totalAvaliate = avaliations / user.avaliate.length
      }

      if (user) await user.save()
      const resUser = await User.findById(id)

      return res.status(200).json(responseWithToken(resUser, newToken))
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }
}

export default new UserController()
