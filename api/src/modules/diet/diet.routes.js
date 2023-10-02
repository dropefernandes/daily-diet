import express from 'express'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'

import { isAuthenticated } from '../../middlewares.js'
import { findUserById } from '../users/users.services.js'
import { create, listByUserId } from './diet.services.js'

const router = express.Router()

router.post('/', isAuthenticated, async (req, res, next) => {

  try {
    const data = req.body
    const { authorization } = req.headers
    const verifyToken = jwt.verify(authorization, process.env.JWT_ACCESS_SECRET)

    const user = await findUserById(verifyToken.userId)

    if (!user) {
      res.status(404)
      throw new Error("User not already!");
    }

    const diet = await create({
      uuid: randomUUID(),
      name: data.name,
      description: data.description,
      date: data.date,
      hour: data.hour,
      isDiet: data.isDiet,
      userId: user.id
    })

    res.status(201)
      .json(diet)
  } catch (err) {
    next(err)
  }
})

router.get('/', isAuthenticated, async (req, res, next) => {

  try {
    const { authorization } = req.headers
    const verifyToken = jwt.verify(authorization, process.env.JWT_ACCESS_SECRET)
    const diets = await listByUserId(verifyToken.userId)


    res.status(200)
      .json(diets)
  } catch (err) {
    next(err)
  }
})

export default router