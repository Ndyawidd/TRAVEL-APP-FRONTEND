import path from "path";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
    };
    return config;
  },
  images: {
    domains: ["via.placeholder.com"], // tambahkan domain yang kamu izinkan
  },
};

export default nextConfig;
