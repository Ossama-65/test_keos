import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ['child_process'],
  },
  turbopack: {
    // Empty config to silence the warning
  },
};

export default nextConfig;
