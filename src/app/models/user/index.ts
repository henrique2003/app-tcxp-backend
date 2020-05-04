import { model, Schema } from 'mongoose'
import UserInterface from './Interface'

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  email: {
    type: String,
    required: true
  },
  country: String,
  state: String,
  city: String,
  celphone: String,
  invites: [{
    user: {
      type: 'ObjectId',
      ref: 'User'
    },
    group: {
      type: 'ObjectId',
      ref: 'Groups'
    },
    select: false
  }],
  receivedRequests: [{
    user: {
      type: 'ObjectId',
      ref: 'User'
    },
    group: {
      type: 'ObjectId',
      ref: 'Groups'
    },
    select: false
  }],
  askRequests: [{
    user: {
      type: 'ObjectId',
      ref: 'User'
    },
    group: {
      type: 'ObjectId',
      ref: 'Groups'
    },
    select: false
  }],
  facebook: String,
  twitter: String,
  instagram: String,
  emailConfirmation: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export default model<UserInterface>('User', UserSchema)
