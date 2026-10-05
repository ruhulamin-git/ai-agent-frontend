//@ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "images.squarespace-cdn.com" },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  transpilePackages: [
    "@devxhub/form-elements",
    "@mui/material",
    "@mui/icons-material",
    "@mui/lab",
    "@mui/styled-engine",
    "@emotion/react",
    "@emotion/styled",
    "@emotion/cache",
    "@mui/material-nextjs",
  ],
  // Experimental features for better performance
  experimental: {
    // Optimize imports from large packages for better tree-shaking
    optimizePackageImports: ["@tabler/icons-react", "react-icons", "framer-motion", "lodash"],
  },
  // Turbopack configuration
  turbopack: {
    resolveAlias: {
      "@public/*": "./public/*",
    },
  },
  // Reduce source map quality in development for less memory usage
  productionBrowserSourceMaps: false,
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Set WEBPACK_USE_POLLING=true in .env.local if needed
      const WEBPACK_USE_POLLING = process.env.WEBPACK_USE_POLLING === "true";

      // Reduce memory usage with optimized caching
      config.cache = {
        type: "filesystem",
        maxMemoryGenerations: 1,
      };

      // Use cheaper source maps in development
      config.devtool = "eval-cheap-module-source-map";

      config.watchOptions = {
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/dist/**",
          "**/build/**",
          "**/coverage/**",
          "**/.next/**",
          "**/libs/**",
          "**/public/images/**",
        ],
      };

      if (WEBPACK_USE_POLLING) {
        config.watchOptions.poll = 1000;
        config.watchOptions.aggregateTimeout = 300;
      }
    }
    return config;
  },
};

module.exports = nextConfig;
