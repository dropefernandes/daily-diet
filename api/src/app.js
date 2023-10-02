import bodyParser from 'body-parser'
import cors from 'cors'
import { config } from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import { errorHandler, notFound } from './middlewares.js'
import api from './modules/index.js'

config()

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  return res.json({
    message: '👋🌎🌍🌏✨'
  })
})

app.use('/api/v1', api);
app.use(notFound);
app.use(errorHandler)

export default app