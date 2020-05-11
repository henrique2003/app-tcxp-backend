import S3 from 'aws-sdk/clients/s3'
import { config } from 'dotenv'
config()

export default {
  secret: process.env.SECRET_TOKEN ?? '',
  s3: new S3({
    accessKeyId: process.env.AWS_KEI_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_DEFAULT_REGION
  }),
  aws_bucket: process.env.AWS_BUCKET ?? '',
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT ?? '',
    user: process.env.MAIL_AUTH_USER,
    pass: process.env.MAIL_AUTH_PASS
  }
}
