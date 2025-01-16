/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  output: 'export',
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
      };
    }
    return config;
  },
  env: {
    NEXT_PUBLIC_DAO_ENGINE_CONTRACT: process.env.DAO_ENGINE_CONTRACT,
    NEXT_PUBLIC_CONTRIBUTION_TRACKER_CONTRACT: process.env.CONTRIBUTION_TRACKER_CONTRACT,
    NEXT_PUBLIC_NETWORK_ID: process.env.NETWORK_ID,
  },
};

module.exports = nextConfig;
