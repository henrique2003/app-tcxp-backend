import multerS3 from 'multer-s3'
import multer from 'multer'
import crypto from 'crypto'
import configs from '../../config/config'

export default multer({
  storage: multerS3({
    s3: configs.s3,
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
