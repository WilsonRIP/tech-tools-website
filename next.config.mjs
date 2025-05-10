/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  experimental: {
    // This is required to fix chunk loading issues
    optimizePackageImports: ['react-icons', 'lucide-react', '@heroicons/react', 'framer-motion'],
  },
  webpack: (config) => {
    // Fix import() chunk loading
    config.module.parser.javascript = {
      ...config.module.parser.javascript,
      dynamicImportMode: 'eager',
    };
    return config;
  },
};

export default nextConfig;
