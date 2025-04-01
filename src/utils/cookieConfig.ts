export const cookieConfig = (maxAge: number) => ({
  httpOnly: true,
  secure: true,
  sameSite: 'none' as 'none',
  maxAge: maxAge,
})
