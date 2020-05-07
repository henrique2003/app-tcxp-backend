import { model, Schema } from 'mongoose'
import UserInterface from './protocols'

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
  facebook: String,
  twitter: String,
  instagram: String,
  rememberMe: {
    type: Boolean,
    default: false
  },
  inviteRequest: [{
    to: {
      type: 'ObjectId',
      ref: 'User'
    },
    from: {
      type: 'ObjectId',
      ref: 'User'
    },
    group: {
      type: 'ObjectId',
      ref: 'Groups'
    }
  }],
  receivedRequest: [{
    to: {
      type: 'ObjectId',
      ref: 'User'
    },
    group: {
      type: 'ObjectId',
      ref: 'Groups'
    }
  }],
  emailConfirmation: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export const User = model<UserInterface>('User', UserSchema)
