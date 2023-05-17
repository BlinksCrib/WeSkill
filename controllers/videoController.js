import Video from '../models/Video.js'
// import Product from '../models/Product.js'

import { StatusCodes } from 'http-status-codes'
import { BadRequestError } from '../errors/index.js'
// const { checkPermissions } = require('../utils/index.js')

const createVideo = async (req, res) => {
  const { courseVid, thumbNail, price, title, descrip, videoLink } = req.body

  if (!courseVid || !thumbNail || !price || !title || !descrip || !videoLink) {
    throw new BadRequestError(
      'Please provide courseVid,thumbNail,price,title,descrip and videoLink'
    )
  }

  const video = await Video.create({
    courseVid,
    thumbNail,
    price,
    title,
    descrip,
    videoLink,
    user: req.user.userId,
  })

  res.status(StatusCodes.CREATED).json({ msg: 'Uploaded Successfully', video })
}
const getAllVideos = async (req, res) => {
  const videos = await Video.find({})
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Fetched Successfully', videos, count: videos.length })
}
// const getSingleOrder = async (req, res) => {
//   const { id: orderId } = req.params
//   const order = await Order.findOne({ _id: orderId })
//   if (!order) {
//     throw new CustomError.NotFoundError(`No order with id : ${orderId}`)
//   }
//   checkPermissions(req.user, order.user)
//   res.status(StatusCodes.OK).json({ order })
// }
// const getCurrentUserOrders = async (req, res) => {
//   const orders = await Order.find({ user: req.user.userId })
//   res.status(StatusCodes.OK).json({ orders, count: orders.length })
// }
// const updateOrder = async (req, res) => {
//   const { id: orderId } = req.params
//   const { paymentIntentId } = req.body

//   const order = await Order.findOne({ _id: orderId })
//   if (!order) {
//     throw new CustomError.NotFoundError(`No order with id : ${orderId}`)
//   }
//   checkPermissions(req.user, order.user)

//   order.paymentIntentId = paymentIntentId
//   order.status = 'paid'
//   await order.save()

//   res.status(StatusCodes.OK).json({ order })
// }

export { createVideo, getAllVideos }
