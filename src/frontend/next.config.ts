import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
        reactCompiler: true,
    },
    webpack: (config: import('webpack').Configuration) => {
        config.resolve = {
            ...config.resolve,
            modules: [
              path.resolve(__dirname, 'node_modules'),
              'node_modules',
              ...(config.resolve?.modules || [])
            ],
        };
        config.resolve.alias = {
          ...config.resolve.alias,
          '@': path.resolve(__dirname),
        };
        return config;
    },
};

export default nextConfig;
