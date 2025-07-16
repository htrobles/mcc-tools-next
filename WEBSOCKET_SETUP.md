# WebSocket Setup with Custom Next.js Server

This document explains the WebSocket implementation using a custom Next.js server that acts as a proxy between the client and the external WebSocket service.

## Architecture

```
Client (Browser) <---> Next.js WebSocket Server <---> External WebSocket Service
```

## How It Works

1. **Client Connection**: The client connects to our Next.js WebSocket server
2. **Job Joining**: When a client wants to monitor a job, it sends a `join-import-job` event
3. **External Connection**: Our server creates a connection to the external WebSocket service (if not already exists)
4. **Event Forwarding**: Progress updates from the external service are forwarded to the client
5. **Connection Management**: The server manages external connections and cleans them up when needed

## Files

### `server.js`

- Custom Next.js server that handles both HTTP requests and WebSocket connections
- Creates Socket.IO server alongside the Next.js app
- Manages external WebSocket connections to the price monitor service
- Forwards events between clients and external service

### `src/lib/priceMonitor/hooks/useProductImportProgress.ts`

- Client-side hook that connects to our local WebSocket server
- Handles progress updates and error states
- Maintains the same API as before

## Environment Variables

```env
MONITOR_PRICE_APP_HOST=http://localhost:3100
PRICE_MONITOR_API_KEY=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

## Benefits

1. **Security**: API keys are kept server-side
2. **Reliability**: Better connection management and error handling
3. **Scalability**: Can handle multiple clients monitoring the same job
4. **Simplicity**: Clean separation between client and external service logic

## Event Flow

1. Client connects to Next.js WebSocket server
2. Client sends `join-import-job` with job ID
3. Server connects to external service (if needed)
4. Server joins external service room for that job
5. External service sends progress updates
6. Server forwards updates to all clients monitoring that job
7. Client receives updates and updates UI

## Error Handling

- Connection errors are logged and forwarded to clients
- External service disconnections are handled gracefully
- Client disconnections clean up resources
- Missing environment variables are caught and reported

## Debugging

Check the server logs for:

- `Client connected: [socket-id]`
- `Client joining import job: [job-id]`
- `Connected to external service for job: [job-id]`
- `Forwarding progress update for job: [job-id]`
- Any connection errors or disconnections
