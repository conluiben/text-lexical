/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      new URL("https://placehold.co/**"),
      new URL("http://localhost:3000/**"),
    ],
    domains: ["localhost"],
  },
};

export default nextConfig;
