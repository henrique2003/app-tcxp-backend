import { Document } from 'mongoose'
import { GroupsDocs } from '../groups/protocols'

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
  invites?: InviteGroup[]
  requests?: InviteGroup[]
}

interface InviteGroup {
  user: User
  Group: GroupsDocs
}
