const exclude = <T extends Record<string, any>>(
  obj: T,
  keys: (keyof T)[]
): Partial<T> => {
  keys.forEach((key) => {
    delete obj[key]
  })
  return obj
}

export default exclude
