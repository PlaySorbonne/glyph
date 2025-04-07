/** @type {import('next').NextConfig} */

import withPWA from "next-pwa";

let AR_Files = [
  "/eye",
  "/kirby-2.jpg",
  "/StreamingAssets/:path*",
  "/Build/:path*",
];

let AR_url = "https://playsorbonne.github.io/jeu_piste_AR";

let nextConfig = {
  output: "standalone",
  reactStrictMode: true, // Enable React strict mode for improved error handling
  // swcMinify: true, // Enable SWC minification for improved performance
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
  async redirects() {
    return [
      {
        source: "/eye",
        destination: "https://webxr.run/Q2nA90N3RwMgp",
        permanent: false,
      },
    ];
  },
};

nextConfig = withPWA({
  dest: "public", // destination directory for the PWA files
  disable: process.env.NODE_ENV === "development", // disable PWA in the development environment
  register: true, // register the PWA service worker
  skipWaiting: true, // skip waiting for service worker activation
})(nextConfig);

export default nextConfig;
