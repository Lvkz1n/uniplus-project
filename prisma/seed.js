const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // No seed data required; this file exists so `prisma db seed` works.
  console.log('Seed finalizado.');
}

main()
  .catch((error) => {
    console.error('Falha no seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
