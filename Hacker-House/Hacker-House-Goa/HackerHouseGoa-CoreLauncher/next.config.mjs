/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output:"export",
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
