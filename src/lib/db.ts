import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create PrismaClient with optimized settings for MongoDB
const createPrismaClient = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    // Add connection pooling configuration through environment variables
    // These can be set in your .env.local file:
    // DATABASE_URL="mongodb://localhost:27017/mcc-tools?maxPoolSize=10&minPoolSize=2&maxIdleTimeMS=30000&connectTimeoutMS=10000&socketTimeoutMS=45000&serverSelectionTimeoutMS=5000&retryWrites=true&retryReads=true"
  });
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// Graceful shutdown handling - only in Node.js environment
if (typeof process !== 'undefined' && process.on) {
  process.on('beforeExit', async () => {
    await db.$disconnect();
  });

  process.on('SIGINT', async () => {
    await db.$disconnect();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await db.$disconnect();
    process.exit(0);
  });
}

export default db;
