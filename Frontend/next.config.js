/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Proxy API calls to backend to avoid CORS issues in dev.
      {
        source: "/api/voice-chat",
        destination: "http://localhost:3000/api/voice-chat",
      },
    ];
  },
};

module.exports = nextConfig;

