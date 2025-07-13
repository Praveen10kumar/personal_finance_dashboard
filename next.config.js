/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable turbopack which is causing issues
  experimental: {
    turbo: false
  },
  // Add image domains configuration
  images: {
    domains: ['randomuser.me', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/api/portraits/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  }
}

module.exports = nextConfig