import transporter from '../../modules/mailer'
import User from '../models/user/protocols'

export const emailConfirmation = (user: User): boolean => {
  try {
    const { email, name, emailConfirmationCode: code } = user
    const message = {
      to: email,
      from: 'contato@tcxp.com',
      template: 'auth/emailConfirmation.ts',
      context: { name, code }
    }

    transporter.sendMail(message, (error) => {
      if (error) { console.log(error) }
      return false
    })

    return true
  } catch (error) {
    return false
  }
}

export const forgotPassword = (user: User): boolean => {
  try {
    const { email, name, forgotPasswordToken: token } = user
    const message = {
      to: email,
      from: 'contato@tcxp.com',
      template: 'auth/forgotPassword.ts',
      context: { name, token }
    }

    transporter.sendMail(message, (error) => {
      if (error) { console.log(error) }
      return false
    })

    return true
  } catch (error) {
    return false
  }
}
