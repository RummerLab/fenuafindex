import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    // humans.txt is site-wide, so the locale-prefixed paths point at the
    // canonical root copy in public/humans.txt.
    return [
      {
        source: "/:locale(en|fr)/humans.txt",
        destination: "/humans.txt",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
