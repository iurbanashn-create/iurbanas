import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sllrcczcapibotckpcvx.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/pulso-urbano-n01',
        destination: '/pulso-urbano-n01.html',
      },
    ];
  },
};

export default nextConfig;
