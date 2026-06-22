/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'meshcdn.s3.amazonaws.com' },
    ],
  },
  webpack: (config, { isServer }) => {
    // Konva 在 server bundle 里会 require 'canvas' 这个 Node native module
    // 我们用 'use client' + dynamic import 避免 SSR，但仍需告诉 webpack 别去解析
    if (isServer) {
      config.externals = [...(config.externals || []), { canvas: 'commonjs canvas' }];
    }
    return config;
  },
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
  },
};
export default nextConfig;