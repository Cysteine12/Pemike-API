const pick = (obj: object, keys: string[]): any => {
  return keys.reduce<{ [key: string]: unknown }>((acc, key) => {
    if (obj && key in obj) {
      acc[key] = obj[key as keyof typeof obj]
    }

    return acc
  }, {})
}

export default pick
