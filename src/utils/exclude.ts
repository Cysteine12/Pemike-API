const exclude = (obj: object, keys: string[]): any => {
  keys.forEach((key) => {
    delete obj[key as keyof typeof obj]
  })
  return obj
}

export default exclude
