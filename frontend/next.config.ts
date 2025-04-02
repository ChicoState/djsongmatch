import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
        reactCompiler: true,
    },
    compiler: {
        // Remove console.log() on client in production builds
        removeConsole: process.env.NODE_ENV === "production",
    },
};

export default nextConfig;
