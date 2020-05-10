import S3 from 'aws-sdk/clients/s3'
import { config } from 'dotenv'
config()

export default {
  secret: '9d123a0ebf7a356232269e46230159cc',
  s3: new S3({
    accessKeyId: process.env.AWS_KEI_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_DEFAULT_REGION
  })
}
