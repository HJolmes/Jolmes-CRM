import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding...')

  const passwordHash = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@jolmes.de' },
    update: {},
    create: {
      email: 'admin@jolmes.de',
      name: 'Admin',
      passwordHash,
      role: 'ADMIN',
    },
  })

  console.log('✅ Seed complete.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())