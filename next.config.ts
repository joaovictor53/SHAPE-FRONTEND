import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['172.16.0.63'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/ai",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/ai`,
      },
    ];
  },
};

export default nextConfig;
