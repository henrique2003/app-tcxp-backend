export const missingParamError = (fields: string = ''): string => {
  return fields ? `Campo ${fields} inválido` : 'Campo inválido'
}
