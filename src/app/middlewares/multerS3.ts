import multerS3 from 'multer-s3'
import multer from 'multer'
import crypto from 'crypto'
import S3 from 'aws-sdk/clients/s3'
import { config } from 'dotenv'
config()

export default multer({
  storage: multerS3({
    s3: new S3({
      accessKeyId: process.env.AWS_KEI_ID,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_DEFAULT_REGION
    }),
    bucket: 'tcxp-upload',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) {
          cb(err, file.fieldname)
        }
        const key = `${hash.toString('hex')}-${file.originalname}`
        cb(null, key)
      })
    }
  }),
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif'
    ]

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type.'))
    }
  }
})
