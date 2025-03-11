/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-444e3790a8b846ddba683d7eadbfc430.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
