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
  inviteRequest: InviteRequest[]
  receivedRequest: ReceiveRequest[]
}

interface InviteRequest {
  to: User
  from: User
  group: Group
}

interface ReceiveRequest {
  from: User
  group: Group
}
