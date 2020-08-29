import { Document } from 'mongoose'

export interface IDenounce extends Document {
  _id: string
  to: string
  from: string
  denounce: string
}
