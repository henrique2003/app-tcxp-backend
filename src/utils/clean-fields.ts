export const cleanFields = (objectFields: any): {} => {
  for (const field of Object.keys(objectFields)) {
    if (typeof objectFields[field] === 'string') {
      objectFields[field] = objectFields[field].trim()
    }
  }

  return objectFields
}
