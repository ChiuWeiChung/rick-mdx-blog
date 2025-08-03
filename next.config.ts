import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'rick-mdx-storage.s3.us-east-2.amazonaws.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'rickchiu.me',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
    ],
  },
  eslint: {
    dirs: ['app', 'components', 'features', 'lib', 'utils', 'actions', 'hooks', 'types'],
  },
};

export default nextConfig;
