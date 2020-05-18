import { Schema, model } from 'mongoose'
import { mongoosePagination } from 'ts-mongoose-pagination'
import { Group } from './protocols'

const GroupsSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    name: String,
    size: Number,
    key: String,
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
    user: {
      type: 'ObjectId',
      ref: 'User'
    },
    content: {
      type: String
    }
  }]
}, {
  timestamps: true
})

GroupsSchema.plugin(mongoosePagination)

export const Groups = model<Group>('Groups', GroupsSchema)
