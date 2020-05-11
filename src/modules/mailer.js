import path from 'path'
import { createTransport } from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport'
import hbs from 'nodemailer-express-handlebars'

import configs from '../config/config'
const { host, port, user, pass } = configs.mail

const transport = createTransport(smtpTransport({
  host,
  port: parseInt(port),
  auth: {
    user,
    pass
  }
}))

const handlebarOptions = {
  viewEngine: {
    extName: '.html',
    partialsDir: path.resolve('./src/resources/mail/'),
    layoutsDir: path.resolve('./src/resources/mail/'),
    defaultLayout: ''
  },
  viewPath: path.resolve('./src/resources/mail/'),
  extName: '.html'
}
transport.use('compile', hbs(handlebarOptions))

export default transport
