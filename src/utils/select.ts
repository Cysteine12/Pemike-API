const select = (keys: string[] | undefined): any => {
  if (!keys) return undefined

  return keys.reduce<{ [key: string]: boolean }>((acc, key) => {
    acc[key] = true
    return acc
  }, {})
}

export default select
