import nextPWA from 'next-pwa';

const withPWA = nextPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.youtube.com', 'i.ibb.co', 'via.placeholder.com'],
  },
  // Otras configuraciones de Next.js aquí
};

export default withPWA(nextConfig);
