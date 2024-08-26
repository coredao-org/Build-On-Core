/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false
      config.resolve.fallback.net = false
      config.resolve.fallback.tls = false
    }
    return config
  },
  async rewrites() {
    return [
      {
        source: '/api-test/staking/:path*',
        destination: 'https://stake.test.btcs.network/api/staking/:path*',
      },
      {
        source: '/api-main/staking/:path*',
        destination: 'https://stake.coredao.org/api/staking/:path*',
      },
    ];
  },
};

export default nextConfig;
