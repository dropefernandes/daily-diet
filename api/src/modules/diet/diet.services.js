import { prisma } from '../../plugins/prisma.js'

export function create (diet) {
  return prisma.diet.create({
    data: diet
  })
}

export function listByUserId(userId) {
  return prisma.diet.findMany({
    where: {
      userId
    }
  })
}