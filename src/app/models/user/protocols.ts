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
    name: String
    size: Number
    key: String
    url: String
  }
  inviteRequest: InviteRequest[]
  receivedRequest: ReceiveRequest[]
}

interface InviteRequest {
  from: User
  group: PaginateResult
}

interface ReceiveRequest {
  to: User
  group: PaginateResult
}
