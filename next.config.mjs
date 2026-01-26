/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  // output: 'standalone',
  output: 'export',
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
    loader: 'custom',
    loaderFile: './lib/image.ts',
  },
  experimental: {
    webpackBuildWorker: true,
    mdxRs: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
};

export default nextConfig;
