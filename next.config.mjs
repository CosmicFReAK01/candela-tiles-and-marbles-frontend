/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  images: {
    // Disable Next.js image optimization API to mitigate image-optimizer CVEs (GHSA-2xp9-vwfh-vxw4, GHSA-2464-fhr4-w9xw)
    unoptimized: true,
    // Restrict image proxying to explicit trusted CDN domains (mitigates GHSA-9g9p-9gw9-jx7f)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    // Explicitly disallow SVG optimization to prevent SVG script execution (mitigates GHSA-2464-fhr4-w9xw)
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
