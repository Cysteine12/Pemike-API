const pick = <T extends Record<string, any>>(obj: T, keys: (keyof T)[]): T => {
  return keys.reduce<T>((acc, key) => {
    if (obj && key in obj) {
      acc[key] = obj[key]
    }

    return acc
  }, {} as T)
}

export default pick
