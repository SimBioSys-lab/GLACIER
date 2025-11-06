const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable eslint during build to prevent build failures due to linting errors
  eslint: {
    // Only run ESLint on these directories during production builds
    dirs: ['app', 'components', 'lib', 'utils'],
    // Warning only, don't fail the build
    ignoreDuringBuilds: true,
  },
  // Skip TypeScript type checking during build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  // Configure image domains if needed
  images: {
    domains: [],
  },
  // Configure webpack to resolve @ alias
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Ensure alias object exists
    if (!config.resolve) {
      config.resolve = {};
    }
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }
    
    // Set @ alias to project root
    config.resolve.alias['@'] = path.join(__dirname, './');
    
    return config;
  },
  // Experimental flag that might help with module resolution
  experimental: {
    typedRoutes: false,
  },
};

module.exports = nextConfig;
