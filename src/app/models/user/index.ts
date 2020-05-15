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
  imageProfile: {
    name: String,
    size: Number,
    key: String,
    url: String
  },
  rememberMe: {
    type: Boolean,
    default: false
  },
  inviteRequest: [{
    from: {
      type: 'ObjectId',
      ref: 'User'
    },
    group: {
      type: 'ObjectId',
      ref: 'Groups'
    }
  }],
  acceptRequest: [{
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
  },
  emailConfirmationExpire: {
    type: Date,
    select: false
  },
  emailConfirmationCode: {
    type: String,
    required: true,
    select: false
  },
  forgotPasswordExpire: {
    type: Date,
    select: false
  },
  forgotPasswordToken: {
    type: String,
    select: false
  }
}, {
  timestamps: true
})

export const User = model<UserInterface>('User', UserSchema)
