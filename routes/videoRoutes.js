import express from 'express'
const router = express.Router()
import {
  authenticateUser,
  authorizePermissions,
} from '../middleware/authentication.js'

import {
  createVideo,
  getAllVideos,
  // getSingleProduct,
  // updateProduct,
  // deleteProduct,
  // uploadVideo,
} from '../controllers/videoController.js'

// import { getSingleProductReviews } from '../controllers/reviewController.js'

router
  .route('/')
  .get(getAllVideos)
  // .post([authenticateUser, authorizePermissions('tutor')], createProduct)

router
  .route('/createVideo')
  .post([authenticateUser, authorizePermissions('tutor')], createVideo)

// router
//   .route('/:id')
//   .get(getSingleProduct)
//   .patch([authenticateUser, authorizePermissions('admin')], updateProduct)
//   .delete([authenticateUser, authorizePermissions('admin')], deleteProduct)

// router.route('/:id/reviews').get(getSingleProductReviews)

export default router
