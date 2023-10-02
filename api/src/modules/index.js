import express from 'express'

import dietRoutes from './diet/diet.routes.js'
import userRoutes from './users/users.routes.js'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  })
})

router.use('/users', userRoutes)
router.use('/diet', dietRoutes)

export default router