import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "standalone",
  reactStrictMode: true, // Enable React strict mode for improved error handling
  swcMinify: true, // Enable SWC minification for improved performance
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
  async rewrites() {
    return {
      afterFiles: [
        {
          source: "/eye/:path*/",
          destination:"https://playsorbonne.github.io/jeu_piste_AR/:path*/",
        },
        {
          source: "/eye",
          destination: "https://playsorbonne.github.io/jeu_piste_AR/",
        },
      ],
    };
  },
};

export default withPWA({
  dest: "public", // destination directory for the PWA files
  disable: process.env.NODE_ENV === "development", // disable PWA in the development environment
  register: true, // register the PWA service worker
  skipWaiting: true, // skip waiting for service worker activation
})(nextConfig);
