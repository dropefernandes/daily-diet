import bcrypt from 'bcrypt'

import { prisma } from '../../plugins/prisma.js'

export function findUserByEmail (email) {
  return prisma.user.findUnique({
    where: {
      email
    }
  })
}

export function createUser (user) {
  user.password = bcrypt.hashSync(user.password, 12)

  return prisma.user.create({
    data: user
  })
}

export function findUserById (id) {
  return prisma.user.findUnique({
    where: {
      id
    }
  })
}