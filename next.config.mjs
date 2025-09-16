/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      new URL("https://placehold.co/**"),
      new URL("https://placehold.co"),
      new URL("http://localhost:3000/**"),
    ],
    domains: ["localhost", "placehold.co"],
  },
};

export default nextConfig;
