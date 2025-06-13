import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
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
		],
	},
};

export default nextConfig;
