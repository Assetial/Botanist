import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: ".botanist-next-v5",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
