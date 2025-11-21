/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable static export for GitHub Pages (only affects 'next build', not 'next dev')
  output: 'export',
  // Required for static export - images won't be optimized
  images: {
    unoptimized: true,
  },
  // Base path for GitHub Pages (update 'profile' to match your repository name)
  // Only applies in production build, dev mode uses empty basePath
  basePath: process.env.NODE_ENV === 'production' ? '/profile' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/profile' : '',
  // Disable trailing slash for cleaner URLs
  trailingSlash: false,
}

module.exports = nextConfig

