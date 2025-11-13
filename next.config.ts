import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: CORS headers removed since we're using server-side FFmpeg in Docker
  // Client-side FFmpeg.wasm was too slow for production use
};

export default nextConfig;
