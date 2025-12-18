/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: '*.unsplash.com',
            },
        ],
    },
    // Tailwind CSS 4.0 지원
    experimental: {
        optimizeCss: true,
    },
}

export default nextConfig;
