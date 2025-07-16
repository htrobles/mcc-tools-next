import { NextRequest } from 'next/server';
import { io as SocketIOClient } from 'socket.io-client';
import { auth } from '@/lib/auth';
import db from '@/lib/db';
import { ImportJobStatus } from '@prisma/client';

type ProgressData = {
  processedProducts?: number;
  failedProducts?: number;
  totalProducts?: number;
  error?: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    console.log('SSE Progress API called');

    // Check authentication
    const session = await auth();
    if (!session?.user) {
      console.log('Unauthorized access attempt');
      return new Response('Unauthorized', { status: 401 });
    }

    const { jobId } = await params;
    console.log('Looking for job:', jobId);

    // Verify job exists and user has access
    const job = await db.productImportJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      console.log('Job not found:', jobId);
      return new Response('Job not found', { status: 404 });
    }

    console.log('Job found, status:', job.status);

    // If job is not pending, return current status immediately
    if (job.status !== ImportJobStatus.PENDING) {
      const response = new Response(
        `data: ${JSON.stringify({
          processedProducts: job.processedProducts ?? 0,
          failedProducts: job.failedProducts ?? 0,
          totalProducts: job.totalProducts ?? 0,
          status: job.status,
        })}\n\n`,
        {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          },
        }
      );

      // Close the connection after sending initial data
      setTimeout(() => {
        response.body?.cancel();
      }, 100);

      return response;
    }

    // Create SSE response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        console.log('Creating socket connection...');

        // Create connection to external service
        const host = process.env.MONITOR_PRICE_APP_HOST;
        const apiKey = process.env.PRICE_MONITOR_API_KEY;

        if (!host || !apiKey) {
          console.error('Missing environment variables');
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: 'Configuration missing' })}\n\n`
            )
          );
          controller.close();
          return;
        }

        const externalSocket = SocketIOClient(host, {
          auth: { apiKey },
        });

        // Send initial data
        const initialData = {
          processedProducts: job.processedProducts ?? 0,
          failedProducts: job.failedProducts ?? 0,
          totalProducts: job.totalProducts ?? 0,
          status: job.status,
        };

        console.log('Sending initial data:', initialData);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(initialData)}\n\n`)
        );

        // Join the import job room
        console.log('Joining import job room:', jobId);
        externalSocket.emit('join-import-job', jobId);

        // Listen for progress updates
        const handleProgress = (data: ProgressData) => {
          console.log('Received progress update:', data);
          if (data && typeof data.error === 'string') {
            const errorData = {
              error: data.error,
              status: ImportJobStatus.ERROR,
            };
            console.log('Sending error data:', errorData);
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`)
            );
            controller.close();
            externalSocket.disconnect();
          } else {
            const progressData = {
              processedProducts: data.processedProducts ?? 0,
              failedProducts: data.failedProducts ?? 0,
              totalProducts: data.totalProducts ?? 0,
              status: ImportJobStatus.PENDING,
            };
            console.log('Sending progress data:', progressData);
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(progressData)}\n\n`)
            );
          }
        };

        console.log('Setting up listener for:', `import-job-${jobId}`);
        externalSocket.on(`import-job-${jobId}`, handleProgress);

        // Handle external socket connection events
        externalSocket.on('connect', () => {
          console.log('Connected to external service for job:', jobId);
        });

        externalSocket.on('connect_error', (error: Error) => {
          console.error('External service connection error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: 'Connection failed' })}\n\n`
            )
          );
          controller.close();
        });

        // Handle client disconnect
        request.signal.addEventListener('abort', () => {
          console.log('Client disconnected, cleaning up...');
          externalSocket.off(`import-job-${jobId}`, handleProgress);
          externalSocket.disconnect();
          controller.close();
        });

        // Handle socket errors
        externalSocket.on('error', (error: Error) => {
          console.error('Socket error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: 'Connection error' })}\n\n`
            )
          );
          controller.close();
        });

        // Handle socket disconnect
        externalSocket.on('disconnect', (reason: string) => {
          console.log('Socket disconnected:', reason);
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in progress stream:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
