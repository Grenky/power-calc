import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'power-calc-omega.vercel.app',
          },
        ],
        destination: 'https://powercalc.digital*',
        permanent: true,
      }
    ]
  }
};

export default nextConfig;
