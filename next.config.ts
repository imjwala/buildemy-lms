import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.fly.storage.tigris.dev`,
        port: '',
        //pathname: '/**',
      },
    ],
  },
  eslint: {
    //  prevents ESLint errors from blocking `next build` / Vercel deploy
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;


