export const validObjectId = (objectId: string): boolean => {
  if (objectId.length !== 24) {
    return false
  }

  return true
}
