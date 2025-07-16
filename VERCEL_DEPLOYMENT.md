# Vercel Deployment - WebSocket Solution

This document explains the Vercel-compatible WebSocket implementation using Server-Sent Events (SSE).

## Problem with Custom Servers on Vercel

Vercel doesn't support custom servers like `server.ts`. When deployed to Vercel, custom servers are ignored, causing `net::ERR_CONNECTION_REFUSED` errors when clients try to connect to WebSocket endpoints that don't exist.

## Solution: Server-Sent Events (SSE)

We've implemented a Vercel-compatible solution using SSE that works with Vercel's serverless infrastructure.

### Architecture

```
Client Browser <---> Vercel SSE API Route <---> External WebSocket Service
```

### How It Works

1. **Client Connection**: Client connects to `/api/jobs/[jobId]/progress` using EventSource
2. **Server-Side WebSocket**: The API route creates a WebSocket connection to the external service
3. **Event Forwarding**: Progress updates from external service are forwarded via SSE to the client
4. **Vercel Compatibility**: Uses standard Next.js API routes that work with Vercel

### Files

#### `src/app/api/jobs/[jobId]/progress/route.ts`

- Vercel-compatible API route using SSE
- Creates WebSocket connection to external service server-side
- Forwards progress updates to client via SSE
- Handles authentication and job validation

#### `src/lib/priceMonitor/hooks/useProductImportProgress.ts`

- Client-side hook using EventSource
- Connects to SSE endpoint
- Handles progress updates and error states
- Maintains the same API for existing components

### Environment Variables

Make sure these are set in your Vercel project:

```env
MONITOR_PRICE_APP_HOST=https://your-external-service.com
PRICE_MONITOR_API_KEY=your-secret-key
NEXTAUTH_URL=https://your-vercel-app.vercel.app
```

### Benefits

1. **Vercel Compatible**: Works with Vercel's serverless infrastructure
2. **Secure**: API keys stay server-side
3. **Reliable**: Better error handling and connection management
4. **Scalable**: Works with Vercel's auto-scaling
5. **Simple**: Uses standard Next.js patterns

### Deployment Steps

1. **Push to Git**: Commit and push your changes
2. **Vercel Deploy**: Vercel will automatically deploy
3. **Set Environment Variables**: Configure in Vercel dashboard
4. **Test**: Verify WebSocket functionality works

### Testing

1. Start a product import job
2. Check browser console for SSE connection
3. Verify progress updates are received
4. Check Vercel function logs for debugging

### Debugging

Check Vercel function logs for:

- `SSE Progress API called`
- `Client joining import job: [job-id]`
- `Connected to external service for job: [job-id]`
- `Forwarding progress update for job: [job-id]`

### Limitations

- SSE is one-way (server to client)
- Connection state management is simpler than WebSocket
- No real-time bidirectional communication (not needed for this use case)

### Migration from Custom Server

The migration maintains the same API for components:

- No changes needed to existing UI components
- Same hook interface (`useProductImportProgress`)
- Same progress data structure
- Same error handling patterns
