import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnAuthenticatedError ,NotFoundError} from '../errors/index.js'
import {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} from '../utils/index.js'

const getAllUsers = async (req, res) => {
  console.log(req.user)
  const users = await User.find({ role: 'user' }).select('-password')
  res.status(StatusCodes.OK).json({ users })
}

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select('-password')
  if (!user) {
    throw new NotFoundError(`No user with id : ${req.params.id}`)
  }
  checkPermissions(req.user, user._id)
  res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).select('-password')
  res.status(StatusCodes.OK).json({ user})
}
// update user with user.save()
const updateUser = async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    phoneNumber,
    shipping_address: {
      address_line_1,
      address_line_2,
      city,
      state,
      postal_code,
      country,
    },
  } = req.body
  if (
    (!email ||
    !firstName ||
    !lastName ||
    !phoneNumber
    )
  ) {
    throw new BadRequestError('Please provide all values')
  }
  const user = await User.findOne({ _id: req.user.userId })

  user.email = email
  user.firstName = firstName
  user.lastName = lastName
  user.phoneNumber = phoneNumber
  user.shipping_address = {
    address_line_1,
    address_line_2,
    city,
    state,
    country,
    postal_code,
  }


  await user.save()

  const tokenUser = createTokenUser(user)
  const { password, ...userData } = user.toObject()
  attachCookiesToResponse({ res, user: tokenUser })
  res.status(StatusCodes.OK).json({ user: userData, tokenUser })
}

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  if (!oldPassword || !newPassword) {
    throw new BadRequestError('Please provide both values')
  }
  const user = await User.findOne({ _id: req.user.userId })

  const isPasswordCorrect = await user.comparePassword(oldPassword)
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError('Invalid Credentials')
  }
  user.password = newPassword

  await user.save()
  res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' })
}

export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
}
