import { Schema, model } from 'mongoose'
import { mongoosePagination } from 'ts-mongoose-pagination'
import { PaginateResult } from './protocols'

const GroupsSchema = new Schema({
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
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

GroupsSchema.plugin(mongoosePagination)

export const Groups = model<PaginateResult>('Groups', GroupsSchema)