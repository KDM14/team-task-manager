const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const memberPassword = await bcrypt.hash('member123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'member@example.com' },
    update: {},
    create: {
      email: 'member@example.com',
      password: memberPassword,
      name: 'Team Member 1',
      role: 'MEMBER',
    },
  });
  
  await prisma.user.upsert({
    where: { email: 'member2@example.com' },
    update: {},
    create: {
      email: 'member2@example.com',
      password: memberPassword,
      name: 'Team Member 2',
      role: 'MEMBER',
    },
  });

  console.log('Database seeded with 3 users:');
  console.log('1. Admin -> admin@example.com / admin123');
  console.log('2. Member 1 -> member@example.com / member123');
  console.log('3. Member 2 -> member2@example.com / member123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
