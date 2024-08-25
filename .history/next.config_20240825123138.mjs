/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer, dev }) => {
    if (!dev && isServer) {
      config.externals.push({
        "chrome-aws-lambda": "chrome-aws-lambda",
      });
    }
    return config;
  },
};

module.exports = nextConfig;
