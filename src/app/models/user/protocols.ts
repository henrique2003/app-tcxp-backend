import { Document } from 'mongoose'
import { PaginateResult } from '../group/protocols'

export default interface User extends Document {
  name: string
  password: string
  email: string
  cpf?: string
  rg?: string
  country?: string
  state?: string
  city?: string
  celphone?: string
  emailConfirmation?: boolean
  facebook?: string
  twitter?: string
  instagram?: string
  rememberMe?: boolean
  imageProfile: {
    name: string
    size: number
    key: string
    url: string
  }
  emailConfirmationExpire?: number
  emailConfirmationCode?: String
  forgotPasswordExpire?: number
  forgotPasswordToken?: String
  inviteRequest?: InviteRequest[]
  receivedRequest?: ReceiveRequest[]
}

interface InviteRequest {
  from: User
  group: PaginateResult
}

interface ReceiveRequest {
  to: User
  group: PaginateResult
}
