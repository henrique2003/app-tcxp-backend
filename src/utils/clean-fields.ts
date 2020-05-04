export const cleanFields = (objectFields: any): {} => {
  for (const field of Object.keys(objectFields)) {
    objectFields[field] = objectFields[field].trim()
  }

  return objectFields
}
