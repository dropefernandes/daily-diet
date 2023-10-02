import bcrypt from 'bcrypt'
import express from 'express'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'

import { isAuthenticated } from '../../middlewares.js'
import { generateTokens } from '../../utils/jwt.js'
import { createUser, findUserByEmail, findUserById } from './users.services.js'

const router = express.Router()

router.post('/', async (req, res, next) => {

  try {
    const { email, password, name } = req.body

    if (!email || !password) {
      res.status(400)
      throw new Error("You must provide an email and a password")
    }

    const userExists = await findUserByEmail(email)

    if (userExists) {
      res.status(400)
      throw new Error("Email already in use.")
    }

    const user = await createUser({
      uuid: randomUUID(),
      name,
      password,
      email
    })

    res.status(201)
      .json({
        user
      })
  } catch (err) {
    next(err)
  }
})

router.get('/', isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.payload;
    const user = await findUserById(userId);
    delete user.password;
    res.json(user);
  } catch (err) {
    next(err);
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('You must provide an email and a password.');
    }

    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      res.status(403);
      throw new Error('Invalid login credentials.');
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      res.status(403);
      throw new Error('Invalid login credentials.');
    }

    const jti = randomUUID()
    const { accessToken, refreshToken } = generateTokens(existingUser, jti)

    res.json({
      accessToken,
      refreshToken
    });
  } catch (err) {
    next(err);
  }
});

router.post('/me', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400);
      throw new Error('Missing refresh token.');
    }
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await findUserById(payload.userId);
    if (!user) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    const jti = randomUUID();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, jti);

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    next(err);
  }
})

export default router