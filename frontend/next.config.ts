import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true, // Bật chế độ strict mode (tùy chọn)

  // Tắt thông báo lỗi chi tiết trong môi trường production
  productionBrowserSourceMaps: false, // Tắt source map để không hiển thị lỗi
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
