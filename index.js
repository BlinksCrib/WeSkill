import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import morgan from 'morgan'
import cors from 'cors'

import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'
// hello
// db and authenticateUser
import connectDB from './db/connect.js'

// routers
import authRouter from './routes/authRoutes.js'
import videoRouter from './routes/videoRoutes.js'

// middleware
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import {authenticateUser} from './middleware/authentication.js'

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// only when ready to deploy

app.set('trust proxy', 1)
app.use(express.json())
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
// app.use(cookieParser(process.env.JWT_SECRET))
app.use(cors())

app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/video', authenticateUser, videoRouter)

  app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
