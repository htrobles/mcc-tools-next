import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server, Socket } from 'socket.io';
import { io as SocketIOClient } from 'socket.io-client';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Prepare the Next.js app
const app = next({ dev, hostname, port: Number(port) });
const handle = app.getRequestHandler();

// Store external socket connections
const externalSockets = new Map();

app.prepare().then(() => {
  const server = createServer(async (req: any, res: any) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Create Socket.IO server
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // Handle WebSocket connections
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    // Handle joining import job
    socket.on('join-import-job', async (jobId: string) => {
      console.log('Client joining import job:', jobId);

      try {
        // Check if we already have a connection to the external service for this job
        let externalSocket = externalSockets.get(jobId);

        if (!externalSocket) {
          // Create new connection to external service
          const host = process.env.MONITOR_PRICE_APP_HOST;
          const apiKey = process.env.PRICE_MONITOR_API_KEY;

          if (!host || !apiKey) {
            socket.emit('error', 'External service configuration missing');
            return;
          }

          externalSocket = SocketIOClient(host, {
            auth: { apiKey },
          });

          // Store the external socket connection
          externalSockets.set(jobId, externalSocket);

          // Handle external socket events
          externalSocket.on('connect', () => {
            console.log('Connected to external service for job:', jobId);
          });

          externalSocket.on('connect_error', (error: any) => {
            console.error('External service connection error:', error);
            socket.emit('error', 'Failed to connect to external service');
          });

          externalSocket.on('disconnect', () => {
            console.log('Disconnected from external service for job:', jobId);
            externalSockets.delete(jobId);
          });

          // Forward progress updates from external service to client
          externalSocket.on(`import-job-${jobId}`, (data: any) => {
            console.log('Forwarding progress update for job:', jobId, data);
            socket.emit(`import-job-${jobId}`, data);
          });

          // Join the import job room on external service
          externalSocket.emit('join-import-job', jobId);
        }

        // Join the client to the room
        socket.join(jobId);
      } catch (error) {
        console.error('Error joining import job:', error);
        socket.emit('error', 'Failed to join import job');
      }
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
