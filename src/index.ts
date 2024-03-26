import serverless from 'serverless-http'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { Router } from './routes/api'
import { connectToMongoDB } from './dataBase/connection'
import { ErrorHandler, NotFoundErrorHandler } from './middlewares'


connectToMongoDB()
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(morgan(':status :method :url :response-time ms'))

app.set('x-powered-by', false)

app.use('/api/v1', Router)

app.use(NotFoundErrorHandler)
app.use(ErrorHandler)

export const handler = serverless(app)
