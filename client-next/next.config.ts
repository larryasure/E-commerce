import type { NextConfig } from "next";

const nextConfig = {
  images: {
    dangerouslyAllowLocalIP: true, // 💡 CRITICAL: Allows Next.js to fetch from 127.0.0.1 locally
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
};

module.exports = nextConfig;

export default NextConfig;
