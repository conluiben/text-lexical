/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL("https://placehold.co/**")],
  },
};

export default nextConfig;
