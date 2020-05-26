import { Document } from 'mongoose'
import { Group } from '../group/protocols'

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
  avaliate: Avaliate[]
  totalAvaliate?: number
  emailConfirmationExpire?: number
  emailConfirmationCode?: String
  forgotPasswordExpire?: number
  forgotPasswordToken?: String
  inviteRequest?: InviteRequest[]
  acceptRequest?: AcceptRequest[]
}

interface InviteRequest {
  from: User
  group: Group
}

interface AcceptRequest {
  to: User
  group: Group
}

interface Avaliate {
  user: User | string
  avaliate: number
}
