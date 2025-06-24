import { PrismaClient } from '@prisma/client';

// Global Prisma instance to prevent multiple connections
declare global {
  var __prisma: PrismaClient | undefined;
}

// Create a single Prisma instance
const prisma = globalThis.__prisma || new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'pretty',
});

// In development, attach to global to prevent hot reload issues
if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  console.log('Disconnecting from database...');
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT, disconnecting from database...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, disconnecting from database...');
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
