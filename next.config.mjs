/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'vjpvvrlxkmldrqfmnnni.supabase.co',
      },
    ],
  },
  experimental: {
    turbo: true,
  },
};

export default nextConfig;
