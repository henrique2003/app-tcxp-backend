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
  facebook: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with Http ou Https'
    ]
  },
  twitter: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with Http ou Https'
    ]
  },
  instagram: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with Http ou Https'
    ]
  },
  emailConfirmation: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export default model<UserInterface>('User', UserSchema)
