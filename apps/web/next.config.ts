import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@evolution/ui", "@evolution/firebase"],
};

export default nextConfig;
