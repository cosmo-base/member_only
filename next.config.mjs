/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: '/member_only', 
  assetPrefix: '/member_only', 
  async redirects() {
    return [
      {
        // /CBED/ で始まるすべてのパスを新しいURLへ飛ばす
        source: '/CBED/:path*',
        destination: 'https://cosmo-base.github.io/event_database/:path*',
        permanent: true, // 301リダイレクト（SEO的に正解）
      },
    ];
  },
};

export default nextConfig;
