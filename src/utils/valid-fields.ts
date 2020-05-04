export function isValidFields (requireFields: string[], fields: any): boolean {
  for (const field of requireFields) {
    if (!fields[field]) return false
  }

  return true
}
