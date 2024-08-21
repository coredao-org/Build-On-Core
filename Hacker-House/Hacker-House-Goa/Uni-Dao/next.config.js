const nextConfig = {
    images: {
      domains: ['assets.aceternity.com', 'i.pinimg.com', 'images.unsplash.com'],
    },
    reactStrictMode: false,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      readline: false,
    };
    return config;
  },
  };
  
  module.exports = nextConfig;
