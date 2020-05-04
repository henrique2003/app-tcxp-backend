import { Schema, model, Model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import PaginateResult from './interface'

const GroupsSchema = new Schema({
  messages: [{
    userName: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  }],
  creator: {
    type: 'ObjectId',
    ref: 'User'
  },
  administrators: [{
    type: 'ObjectId',
    ref: 'User'
  }],
  members: [{
    type: 'ObjectId',
    ref: 'User'
  }],
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageProfile: {
    type: String,
    key: String,
    originalName: String,
    url: String
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

GroupsSchema.plugin(mongoosePaginate)

export const Groups: Model<PaginateResult> = model<PaginateResult>('Groups', GroupsSchema)
