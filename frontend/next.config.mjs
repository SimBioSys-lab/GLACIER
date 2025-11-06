import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable eslint during build to prevent build failures due to linting errors
  eslint: {
    // Only run ESLint on these directories during production builds
    dirs: ['app', 'components', 'lib', 'utils'],
    // Warning only, don't fail the build
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  // Configure image domains if needed
  images: {
    domains: [],
  },
  // Configure webpack to resolve @ alias
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': join(__dirname, './'),
    };
    return config;
  },
};

export default nextConfig;
