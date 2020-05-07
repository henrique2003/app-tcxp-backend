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
  invitesRequest?: InviteGroup[]
  receivedRequest?: InviteGroup[]
}

interface InviteGroup {
  to: User
  from: User
  group: Group
}
