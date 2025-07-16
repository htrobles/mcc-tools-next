# MongoDB Connection Optimization Guide

This guide explains the changes made to optimize MongoDB connections and prevent connection leaks in the MCC Tools application.

## Problem

The application was experiencing significant increases in concurrent MongoDB connections, which was consuming database connection limits. This was caused by:

1. **Improper PrismaClient instantiation**: Creating new PrismaClient instances without proper singleton management
2. **Hot reloading issues**: Next.js development mode creating multiple connections during hot reloads
3. **Missing connection pooling**: No connection pool configuration to manage connection lifecycle
4. **No graceful shutdown**: Connections not properly closed when the application shuts down

## Solution

### 1. PrismaClient Singleton Pattern

The `src/lib/db.ts` file now implements a proper singleton pattern:

```typescript
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
```

This ensures:

- Only one PrismaClient instance exists across the application
- Connections are reused instead of creating new ones
- Hot reloading doesn't create multiple instances

### 2. Connection Pooling Configuration

Add MongoDB connection pooling parameters to your `DATABASE_URL` in `.env.local`:

```env
DATABASE_URL="mongodb://localhost:27017/mcc-tools?maxPoolSize=10&minPoolSize=2&maxIdleTimeMS=30000&connectTimeoutMS=10000&socketTimeoutMS=45000&serverSelectionTimeoutMS=5000&retryWrites=true&retryReads=true"
```

#### Connection Pool Parameters Explained:

- **maxPoolSize=10**: Maximum number of connections in the pool (default: 100)
- **minPoolSize=2**: Minimum number of connections to maintain (default: 0)
- **maxIdleTimeMS=30000**: Maximum time a connection can remain idle (30 seconds)
- **connectTimeoutMS=10000**: Connection timeout (10 seconds)
- **socketTimeoutMS=45000**: Socket timeout (45 seconds)
- **serverSelectionTimeoutMS=5000**: Server selection timeout (5 seconds)
- **retryWrites=true**: Enable retry for write operations
- **retryReads=true**: Enable retry for read operations

### 3. Graceful Shutdown Handling

The application now properly handles shutdown signals:

```typescript
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
```

This ensures connections are properly closed when the application shuts down.

### 4. Development vs Production Logging

Different logging levels for development and production:

```typescript
log: process.env.NODE_ENV === 'development'
  ? ['query', 'error', 'warn']
  : ['error'];
```

- **Development**: Logs queries, errors, and warnings for debugging
- **Production**: Only logs errors to reduce noise

## Recommended Connection Pool Settings

### For Development:

```env
DATABASE_URL="mongodb://localhost:27017/mcc-tools?maxPoolSize=5&minPoolSize=1&maxIdleTimeMS=30000&connectTimeoutMS=5000&socketTimeoutMS=30000&serverSelectionTimeoutMS=3000&retryWrites=true&retryReads=true"
```

### For Production:

```env
DATABASE_URL="mongodb://your-mongodb-url/mcc-tools?maxPoolSize=20&minPoolSize=5&maxIdleTimeMS=60000&connectTimeoutMS=10000&socketTimeoutMS=45000&serverSelectionTimeoutMS=5000&retryWrites=true&retryReads=true&w=majority&j=true"
```

## Monitoring Connection Usage

### MongoDB Atlas (if using):

1. Go to your cluster dashboard
2. Navigate to "Metrics" tab
3. Monitor "Connections" metric
4. Set up alerts for high connection usage

### Local MongoDB:

```bash
# Check current connections
db.serverStatus().connections

# Monitor connections over time
db.currentOp()
```

## Additional Optimizations

### 1. Query Optimization

- Use database indexes for frequently queried fields
- Implement pagination for large datasets
- Use `select` to only fetch required fields

### 2. Connection Monitoring

- Monitor connection pool usage
- Set up alerts for connection limits
- Regularly review and adjust pool sizes

### 3. Application-Level Optimizations

- Implement request timeouts
- Use connection pooling at the application level
- Cache frequently accessed data

## Troubleshooting

### High Connection Count

1. Check if the singleton pattern is working correctly
2. Verify connection pool settings
3. Monitor for connection leaks in long-running operations
4. Review application logs for connection errors

### Connection Timeouts

1. Increase `connectTimeoutMS` and `socketTimeoutMS`
2. Check network connectivity
3. Verify MongoDB server health
4. Review connection pool size settings

### Performance Issues

1. Optimize database queries
2. Add appropriate indexes
3. Review connection pool settings
4. Monitor query performance

## Next Steps

1. Update your `.env.local` file with the recommended connection string
2. Restart your development server
3. Monitor connection usage
4. Adjust pool settings based on your application's needs
5. Set up monitoring and alerts for production

## References

- [Prisma MongoDB Connection Management](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [MongoDB Connection String Options](https://docs.mongodb.com/manual/reference/connection-string/)
- [Next.js Prisma Best Practices](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices)
