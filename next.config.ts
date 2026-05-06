import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better dev experience
  reactStrictMode: true,

  // Image optimization: Allow external image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-media.sforum.vn',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
    ],
  },

  // Experimental performance features
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: ['framer-motion', '@radix-ui/react-avatar', '@radix-ui/react-slot'],
  },

  // Production source maps for debugging
  productionBrowserSourceMaps: false,
};

export default nextConfig;
