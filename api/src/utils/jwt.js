import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET || 'your-secret-key'

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, secret)
  } catch (err) {
    return null
  }
}
