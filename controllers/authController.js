import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'
import { createTokenUser, createJWT } from '../utils/index.js'

const register = async (req, res) => {
  const { email, uName, password, cPassword,roles  } = req.body

  const emailAlreadyExists = await User.findOne({ email })
  if (emailAlreadyExists) {
    throw new BadRequestError('Email already exists')
  }

  const uNameAlreadyExists = await User.findOne({ uName })
  if (uNameAlreadyExists) {
    throw new BadRequestError('User Name already exists')
  }

  if(password !== cPassword) {
        throw new BadRequestError('Password does not match with the Confirm Password')
  }

  // first registered user is an admin
 const isFirstAccount = (await User.countDocuments({})) === 0
//  const selectedRole = roles || 'admin'
 const role = isFirstAccount ? 'admin' : roles

  const user = await User.create({
    email,
    uName,
    password,
    role,
  })
  const tokenUser = createTokenUser(user)
  // attachCookiesToResponse({ res, user: tokenUser })
  const token = createJWT({ payload: tokenUser })
  res
    .status(StatusCodes.CREATED)
    .json({ msg: 'Register Sucessfully', user: tokenUser, token })
}
const login = async (req, res) => {
  const { uName, password } = req.body

  if (!uName || !password) {
    throw new BadRequestError('Please provide uName and password')
  }


  const user = await User.findOne({ uName })

  console.log(user);

  if (!user) {
    throw new UnAuthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError('Invalid Credentials')
  }
   const tokenUser = createTokenUser(user)
   //   attachCookiesToResponse({ res, user: tokenUser })
   const token = createJWT({ payload: tokenUser })

   res
     .status(StatusCodes.OK)
     .json({ msg: 'Login Succesfully', user: tokenUser, token })
}


const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  })
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' })
}

export {
  register,
  login,
  logout,
}
