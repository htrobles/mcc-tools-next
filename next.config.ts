import { STORES } from '@/lib/stores';
import { Store } from '@prisma/client';
import type { NextConfig } from 'next';
import { RemotePattern } from 'next/dist/shared/lib/image-config';

const remotePatterns: RemotePattern[] = Object.keys(STORES).map((key) => {
  const store = STORES[key as Store];
  return {
    protocol: 'https',
    hostname: store.imageHost,
    port: '',
    pathname: '/**',
  };
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...remotePatterns,
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Additional patterns for common image hosting domains
      {
        protocol: 'https',
        hostname: 'www.drumland.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drumland.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'shop.theartsmusicstore.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'musicredone.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb',
    },
    typedRoutes: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
