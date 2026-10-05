#!/usr/bin/env node

/**
 * Docker entrypoint for Next.js standalone server.
 *
 * Responsibilities:
 *   1. Load the build-time Next.js standalone configuration.
 *   2. Add runtime image hosts from:
 *        API_PUBLIC_URL
 *        MEDIA_BASE_URL
 *        IMAGE_REMOTE_HOSTS
 *   3. Synchronize required-server-files.json.
 *   4. Print runtime environment diagnostics.
 *   5. Start the standalone Next.js server.
 *
 * All logs go to stdout/stderr for Docker/Dokploy.
 */

const fs = require("fs");
const path = require("path");

// =============================================================================
// Logging
// =============================================================================

function timestamp() {
  return new Date().toISOString();
}

function log(...args) {
  console.log(`[${timestamp()}] [entrypoint]`, ...args);
}

function warn(...args) {
  console.warn(`[${timestamp()}] [entrypoint]`, ...args);
}

function error(...args) {
  console.error(`[${timestamp()}] [entrypoint]`, ...args);
}

// =============================================================================
// Process-level error handling
// =============================================================================

process.on("uncaughtException", (err) => {
  error("UNCAUGHT EXCEPTION");
  error(err?.stack || err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  error("UNHANDLED PROMISE REJECTION");
  error(reason?.stack || reason);
});

process.on("SIGTERM", () => {
  log("Received SIGTERM");
});

process.on("SIGINT", () => {
  log("Received SIGINT");
});

// =============================================================================
// Environment logging
// =============================================================================

function isSet(value) {
  return value !== undefined && value !== null && value !== "";
}

function logEnv(name, options = {}) {
  const {
    sensitive = false,
    defaultValue = undefined,
  } = options;

  const value = process.env[name];

  if (!isSet(value)) {
    if (isSet(defaultValue)) {
      log(`${name}: NOT SET (default: ${defaultValue})`);
    } else {
      warn(`${name}: NOT SET`);
    }

    return;
  }

  if (sensitive) {
    log(`${name}: SET [REDACTED]`);
    return;
  }

  log(`${name}: ${value}`);
}

function logEnvironment() {
  log("========================================");
  log("Runtime environment");
  log("========================================");

  // ---------------------------------------------------------------------------
  // Next.js public configuration
  // ---------------------------------------------------------------------------

  log("--- Next.js environment variables ---");

  logEnv("NEXT_PUBLIC_ROOT_API_URL");

  logEnv("NEXT_PUBLIC_WEBSOCKET_BASE_URL");

  // Never expose this value in logs.
  logEnv("NEXT_PUBLIC_ENCRYPTION_KEY", {
    sensitive: true,
  });

  logEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID");

  logEnv("NEXT_PUBLIC_GOOGLE_REDIRECT_URI");

  logEnv("NEXT_PUBLIC_GOOGLE_AUTHORIZE_URL");

  // ---------------------------------------------------------------------------
  // Recaptcha
  // ---------------------------------------------------------------------------

  log("--- Recaptcha environment variables ---");

  logEnv("NEXT_PUBLIC_RECAPTCHA_KEY");

  logEnv("NEXT_PUBLIC_RECAPTCHA_ENABLED");

  // ---------------------------------------------------------------------------
  // Build/runtime options
  // ---------------------------------------------------------------------------

  log("--- Runtime configuration ---");

  logEnv("WEBPACK_USE_POLLING");

  logEnv("NEXT_PUBLIC_ENABLE_RQ_DEVTOOLS");

  logEnv("HOSTNAME", {
    defaultValue: "0.0.0.0",
  });

  logEnv("PORT", {
    defaultValue: "3000",
  });

  // ---------------------------------------------------------------------------
  // Image runtime configuration
  // ---------------------------------------------------------------------------

  log("--- Runtime image configuration ---");

  logEnv("API_PUBLIC_URL");

  logEnv("MEDIA_BASE_URL");

  logEnv("IMAGE_REMOTE_HOSTS");

  log("========================================");
}

// =============================================================================
// Runtime image host configuration
// =============================================================================

function runtimePatterns() {
  const patterns = [];
  const seen = new Set();

  const add = (raw) => {
    if (!raw) {
      return;
    }

    const trimmed = String(raw).trim();

    if (!trimmed) {
      return;
    }

    try {
      const url = new URL(
        trimmed.includes("://")
          ? trimmed
          : `https://${trimmed}`
      );

      const pattern = {
        protocol: url.protocol.replace(":", ""),
        hostname: url.hostname,
        ...(url.port
          ? {
              port: url.port,
            }
          : {}),
      };

      const key =
        `${pattern.protocol}://` +
        `${pattern.hostname}:` +
        `${pattern.port ?? ""}`;

      if (!seen.has(key)) {
        seen.add(key);
        patterns.push(pattern);
      }
    } catch {
      warn(
        `Ignoring unparsable image host: ${trimmed}`
      );
    }
  };

  add(process.env.API_PUBLIC_URL);

  add(process.env.MEDIA_BASE_URL);

  for (
    const entry of (
      process.env.IMAGE_REMOTE_HOSTS || ""
    ).split(",")
  ) {
    add(entry);
  }

  return patterns;
}

// =============================================================================
// Startup
// =============================================================================

log("========================================");
log("Starting Next.js container");
log("========================================");

log(`Process PID: ${process.pid}`);
log(`Working directory: ${process.cwd()}`);
log(`Entrypoint directory: ${__dirname}`);

logEnvironment();

// =============================================================================
// Load standalone server.js
// =============================================================================

const serverJsPath = path.join(
  __dirname,
  "server.js"
);

log(`Loading standalone server: ${serverJsPath}`);

let serverJs;

try {
  serverJs = fs.readFileSync(
    serverJsPath,
    "utf8"
  );
} catch (err) {
  error(
    `Unable to read server.js: ${err.message}`
  );

  process.exit(1);
}

// =============================================================================
// Extract build-time Next.js configuration
// =============================================================================

const match = serverJs.match(
  /^const nextConfig = (\{.*\})$/m
);

if (!match) {
  error(
    "nextConfig literal not found in server.js."
  );

  error(
    "The Next.js standalone layout may have changed."
  );

  error(
    "Update docker-entrypoint.js to match the generated server.js."
  );

  process.exit(1);
}

let nextConfig;

try {
  nextConfig = JSON.parse(match[1]);

  log(
    "Successfully loaded build-time Next.js configuration"
  );
} catch (err) {
  error(
    `Unable to parse baked Next.js config: ${err.message}`
  );

  process.exit(1);
}

// =============================================================================
// Runtime image configuration
// =============================================================================

const images =
  (nextConfig.images =
    nextConfig.images || {});

const merged = [
  ...(images.remotePatterns || []),
];

const getPatternKey = (pattern) =>
  `${pattern.protocol}://${pattern.hostname}:${
    pattern.port ?? ""
  }`;

const seen = new Set(
  merged.map(getPatternKey)
);

const runtimeImagePatterns =
  runtimePatterns();

log(
  `Runtime image hosts detected: ${runtimeImagePatterns.length}`
);

for (
  const pattern of runtimeImagePatterns
) {
  const patternKey =
    getPatternKey(pattern);

  if (!seen.has(patternKey)) {
    seen.add(patternKey);

    merged.push(pattern);

    log(
      `Added runtime image host: ` +
        `${pattern.protocol}://` +
        `${pattern.hostname}` +
        `${pattern.port ? `:${pattern.port}` : ""}`
    );
  } else {
    log(
      `Image host already configured: ` +
        `${pattern.protocol}://` +
        `${pattern.hostname}` +
        `${pattern.port ? `:${pattern.port}` : ""}`
    );
  }
}

images.remotePatterns = merged;

log("========================================");
log("Final next/image remote patterns");
log("========================================");

if (merged.length === 0) {
  log("(none)");
} else {
  merged.forEach((pattern, index) => {
    log(
      `${index + 1}. ` +
        `${pattern.protocol}://` +
        `${pattern.hostname}` +
        `${pattern.port ? `:${pattern.port}` : ""}`
    );
  });
}

// =============================================================================
// Synchronize required-server-files.json
// =============================================================================

const rsfPath = path.join(
  __dirname,
  ".next",
  "required-server-files.json"
);

try {
  log(
    `Synchronizing: ${rsfPath}`
  );

  const rsf = JSON.parse(
    fs.readFileSync(
      rsfPath,
      "utf8"
    )
  );

  if (rsf && rsf.config) {
    rsf.config.images =
      nextConfig.images;

    fs.writeFileSync(
      rsfPath,
      JSON.stringify(rsf)
    );

    log(
      "required-server-files.json synchronized successfully"
    );
  } else {
    warn(
      "required-server-files.json does not contain a config object"
    );
  }
} catch (err) {
  warn(
    `Could not sync required-server-files.json: ${err.message}`
  );
}

// =============================================================================
// Next.js runtime configuration
// =============================================================================

process.chdir(__dirname);

process.env.NODE_ENV = "production";

process.env.__NEXT_PRIVATE_STANDALONE_CONFIG =
  JSON.stringify(nextConfig);

require("next");

const {
  startServer,
} = require(
  "next/dist/server/lib/start-server"
);

// =============================================================================
// Server configuration
// =============================================================================

const port =
  parseInt(
    process.env.PORT,
    10
  ) || 3000;

const hostname =
  process.env.HOSTNAME ||
  "0.0.0.0";

let keepAliveTimeout =
  parseInt(
    process.env.KEEP_ALIVE_TIMEOUT,
    10
  );

if (
  Number.isNaN(
    keepAliveTimeout
  ) ||
  !Number.isFinite(
    keepAliveTimeout
  ) ||
  keepAliveTimeout < 0
) {
  keepAliveTimeout =
    undefined;
}

// =============================================================================
// Final startup information
// =============================================================================

log("========================================");
log("Next.js server configuration");
log("========================================");

log(`NODE_ENV: ${process.env.NODE_ENV}`);
log(`HOSTNAME: ${hostname}`);
log(`PORT: ${port}`);
log(
  `KEEP_ALIVE_TIMEOUT: ${
    keepAliveTimeout ?? "default"
  }`
);

log(
  `NEXT_PUBLIC_ROOT_API_URL configured: ${
    isSet(
      process.env.NEXT_PUBLIC_ROOT_API_URL
    )
      ? "YES"
      : "NO"
  }`
);

log(
  `NEXT_PUBLIC_WEBSOCKET_BASE_URL configured: ${
    isSet(
      process.env.NEXT_PUBLIC_WEBSOCKET_BASE_URL
    )
      ? "YES"
      : "NO"
  }`
);

log(
  `NEXT_PUBLIC_GOOGLE_CLIENT_ID configured: ${
    isSet(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    )
      ? "YES"
      : "NO"
  }`
);

log(
  `NEXT_PUBLIC_RECAPTCHA_KEY configured: ${
    isSet(
      process.env.NEXT_PUBLIC_RECAPTCHA_KEY
    )
      ? "YES"
      : "NO"
  }`
);

log("========================================");

log(
  `Starting Next.js server on ${hostname}:${port}...`
);

// =============================================================================
// Start Next.js
// =============================================================================

startServer({
  dir: __dirname,
  isDev: false,
  config: nextConfig,
  hostname,
  port,
  allowRetry: false,
  keepAliveTimeout,
}).catch((err) => {
  error("========================================");
  error("NEXT.JS SERVER FAILED");
  error("========================================");

  error(
    err?.stack || err
  );

  process.exit(1);
});