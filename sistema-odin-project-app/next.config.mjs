import nextPWA from 'next-pwa';

const withPWA = nextPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true, 
  sw: '/sw.js',
  buildExcludes: [/app-build-manifest.json/]
});


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.youtube.com', 'i.ibb.co', 'via.placeholder.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /app-build-manifest\.json$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/chunks/[name].[hash][ext][query]',
      },
    });
    return config;
  },
};


export default withPWA(nextConfig);
