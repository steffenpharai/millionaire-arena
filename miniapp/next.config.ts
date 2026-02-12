import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: "/.well-known/farcaster.json", destination: "/well-known/farcaster.json" }];
  },
};

export default nextConfig;
