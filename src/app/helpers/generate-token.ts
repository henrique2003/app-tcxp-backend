import { sign } from 'jsonwebtoken'
import configs from '../../config/config'

export const generateToken = (id: string): string => {
  return sign({ id }, configs.secret, { expiresIn: 86400 })
}
