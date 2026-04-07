/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      
      {
        source: "/api/voice-chat",
        destination: "https://doctorsai.onrender.com/api/voice-chat",
      },
    ];
  },
};

module.exports = nextConfig;

