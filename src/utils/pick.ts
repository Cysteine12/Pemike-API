const pick = <T extends Record<string, any>> (obj: T, keys: (keyof T)[]): Partial<T> => {
  return keys.reduce<Partial<T>>((acc, key) => {
    if (obj && key in obj) {
      acc[key] = obj[key]
    }

    return acc
  }, {})
}

export default pick
