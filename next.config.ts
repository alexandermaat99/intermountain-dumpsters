import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'acsxwvvvlfajjizqwcia.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/dumpster-images/**',
      },
    ],
  },
};

export default nextConfig;
