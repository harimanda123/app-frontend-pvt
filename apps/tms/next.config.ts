import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @qubere/db is a local TS workspace package (packages/db), not a pre-built
  // npm package -- Next must compile its TypeScript source rather than
  // treating it as opaque runtime code. App Router + Turbopack/webpack
  // transpile workspace packages automatically in most cases, but this is
  // kept explicit since it's a hard requirement for the build to work.
  transpilePackages: ["@qubere/db"],
  async rewrites() {
    return [
      {
        source: "/__clerk/:path*",
        destination: "https://clerk.qubere.ai/:path*",
      },
    ];
  },
};

export default nextConfig;
