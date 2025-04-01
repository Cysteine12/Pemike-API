export const cookieConfig = (maxAge) => ({
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: maxAge,
});
