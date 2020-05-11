import transporter from '../../modules/mailer'

export const emailConfirmation = (user: any): boolean => {
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
