import { Document } from 'mongoose'
import UserInterface from '../User/Interface'

export default interface PaginateResult extends Document {
  docs: GroupsDocsInterface[]
  total: number
  limit: number
  page?: number
  pages?: number
  offset?: number
}

export interface GroupsDocsInterface {
  title: string
  description: string
  imageProfile: {
    key: string
    originalName: string
    url: string
  }
  messages: {
    userName: string
    content: string
  }
  creator: UserInterface
  administrators: UserInterface
  members: UserInterface
}
