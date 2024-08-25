/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        "@sparticuz/chromium": "@sparticuz/chromium",
      });
    }
    return config;
  },
};

module.exports = nextConfig;
