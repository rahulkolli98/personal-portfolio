import type { NextConfig } from "next";

// Update BLOG_URL to your deployed blog domain
const BLOG_URL = "https://blog.rahulkolli.dev";

const nextConfig: NextConfig = {
  serverExternalPackages: ["ably"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/blog",
        destination: BLOG_URL,
        permanent: true,
      },
      {
        source: "/blog/:path*",
        destination: `${BLOG_URL}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

