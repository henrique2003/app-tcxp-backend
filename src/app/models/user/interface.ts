import { Document } from 'mongoose'
import { GroupsDocsInterface } from '../Groups/interface'

export default interface UserInterface extends Document {
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
  user: UserInterface
  Group: GroupsDocsInterface
}
