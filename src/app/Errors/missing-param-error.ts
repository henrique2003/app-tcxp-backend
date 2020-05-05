export const missingParamError = (fields: string = ''): string => {
  return fields ? `Campo ${fields} em branco` : 'Campo em branco'
}
