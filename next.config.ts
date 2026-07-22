import type { NextConfig } from 'next';

// next.config.js
// module.exports = {
//   async headers() {
//     return [
//       {
//         source: '/:path*',
//         headers: [
//           {
//             key: 'Content-Security-Policy',
//             value: "frame-src https://checkout.paystack.com https://js.paystack.co; script-src 'self' 'unsafe-inline' https://js.paystack.co;",
//           },
//         ],
//       },
//     ];
//   },
// };

module.exports = {
  allowedDevOrigins: ['10.209.91.103'],
};

const nextConfig: NextConfig = {/* config options here */};

export default nextConfig;
