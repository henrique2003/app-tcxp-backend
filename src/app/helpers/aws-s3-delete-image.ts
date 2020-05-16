import configs from '../../config/config'

export const awsS3DeleteImage = (imageKey: string): void => {
  const s3 = configs.s3
  s3.deleteObject({
    Bucket: configs.aws_bucket,
    Key: imageKey
  }).promise()
}
