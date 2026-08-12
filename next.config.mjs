// Static export is opt-in via NEXT_STATIC_EXPORT=1 (used for Firebase Hosting).
// Without it (e.g. on Vercel) the app builds exactly as before — SSR + next/image
// optimization + the /menu redirect — so existing deploys are untouched.
const isExport = process.env.NEXT_STATIC_EXPORT === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(isExport ? { output: "export" } : {}),
  // redirects() aren't supported by static export — handled in firebase.json there.
  ...(isExport
    ? {}
    : {
        async redirects() {
          return [{ source: "/menu", destination: "/", permanent: true }];
        },
      }),
  images: {
    // Serve images as-is (no Vercel Image Optimization → 0 transformations).
    // Sources are already right-sized: product photos are compressed to JPEG on
    // upload, and category banners come pre-sized from Unsplash.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Firebase Storage download URLs (product photos).
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "**.firebasestorage.app",
      },
    ],
  },
};

export default nextConfig;
