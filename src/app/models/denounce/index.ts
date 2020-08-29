import { Schema, model } from 'mongoose'
import { mongoosePagination } from 'ts-mongoose-pagination'
import { IDenounce } from './protocols'

const denounceSchema = new Schema({
  to: {
    type: 'ObjectId',
    ref: 'User'
  },
  from: {
    type: 'ObjectId',
    ref: 'User'
  },
  denounce: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
})

denounceSchema.plugin(mongoosePagination)

export const Denounce = model<IDenounce>('Denounce', denounceSchema)
