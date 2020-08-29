import { Request, Response } from 'express'
import { Denounce, User } from '../models'
import { serverError, missingParamError, notFound } from '../errors'
import { responseWithToken } from '../helpers'
import { isValidFields } from '../../utils'

class DenounceController {
  public async index (req: Request, res: Response) {
    try {
      const { newToken, query } = req
      const { page = 1 } = query

      const options = {
        perPage: page,
        limit: 5,
        populate: 'to from'
      }

      const denounces = await Denounce.paginate({}, options)

      return res.status(200).json(responseWithToken(denounces, newToken))
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }

  public async store (req: Request, res: Response) {
    try {
      const { body, userId, params, newToken } = req
      const { id } = params

      const requiredFields = ['denounce']
      if (!isValidFields(requiredFields, body)) {
        return res.status(400).json(responseWithToken(missingParamError(), newToken))
      }

      if (!id) {
        return res.status(400).json(responseWithToken(missingParamError(), newToken))
      }

      if (!await User.findById(id)) {
        return res.status(404).json(responseWithToken(notFound('User'), newToken))
      }

      body.to = userId
      body.from = id

      const newDenounce = await Denounce.create(body)

      return res.status(200).json(responseWithToken(newDenounce, newToken))
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }
}

export default new DenounceController()
