import mongoose from 'mongoose'

// const VideoSchema = mongoose.Schema({
//   name: { type: String, required: true },
//   image: { type: String, required: true },
//   price: { type: Number, required: true },
//   amount: { type: Number, required: true },
//   product: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'Product',
//     required: true,
//   },
// })

const VideoSchema = mongoose.Schema(
  {
    courseVid: {
      type: String,
      required: [true, 'Please provide video'],
    },
    thumbNail: {
      type: String,
      required: [true, 'Please provide picture of thumbnail'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide video price'],
    },
    title: {
      type: String,
      required: [true, 'Please provide video title'],
    },
    descrip: {
      type: String,
      required: [true, 'Please provide video description'],
    },
    videoLink: {
      type: String,
      required: [true, 'Please provide video description'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Video', VideoSchema)
