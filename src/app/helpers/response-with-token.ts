interface ResponseWithToken {
  body: any
  token?: string
}

export const responseWithToken = (body: any, token: string): ResponseWithToken => {
  return token ? { body, token } : { body }
}
