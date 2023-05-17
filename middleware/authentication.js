import { UnAuthenticatedError, UnauthorizedError } from '../errors/index.js'
import { isTokenValid } from '../utils/index.js'

const authenticateUser = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnAuthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]

  try {
    const { uName, email, userId, role } = isTokenValid({ token })
    req.user = { uName, email, userId, role }
    next()
  } catch (error) {
    throw new UnAuthenticatedError('Authentication Invalid')
  }
}

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('Unauthorized to access this route')
    }
    next()
  }
}

export { authenticateUser, authorizePermissions }
