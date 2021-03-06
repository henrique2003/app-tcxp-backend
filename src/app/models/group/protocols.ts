import { Document } from 'mongoose'
import User from '../user/protocols'

export interface PaginateResult extends Document {
  data: Group[]
  pagination: IPagination
}

interface IPagination {
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
  perPage: number
  page?: number | null
  totalPages?: number
}

export interface Group extends Document {
  title: string
  description: string
  image: {
    name: string
    size: number
    key: string
    url: string
  }
  messages?: Messages[]
  creator?: User[] | string
  administrators?: User[] | string
  members?: User[] | string
}

interface Messages {
  _id?: string
  user?: User | string
  content?: string
  inviteDate?: Date
}
