// If you can read this, and you're not a Tako developer...
// Congratulations! You can Read! 🎉

// This actually is not so-secret configuration lol, and was meant to be used on client-side only.
export const CONFIGS = {
    get ASSETS_BASE_URL() {
        if (typeof window === "undefined") return undefined;

        // Dev Mode -> Do not prefix assets url
        if (import.meta.env.DEV) {
            return undefined;
        }

        // Default: Staging Mode -> Prefix with Staging CDN
        return "https://status.tako.id";
    },
    get GA4_ID() {
        // TODO: Change this to your own GA4 ID
        return import.meta.env.PROD ? "G-Z2CX9LLGE0" : undefined;
    },
    CF_ZONE_ID: "1a7010aee8a4e8de8a61bec339e4f7ae",
    CF_API_TOKEN: {
        READ_HEALTH_CHECKS: "GaUAnaxoI0CXToniyyrcxNy1nRZNyFknYpuMlpdq",
        QUERY_GRAPHQL: "RKpsljTAPT1Wj20zgGkAHfkHLKrl0-VNAPFHr0Je",
    },
} as const;

export const LOCAL_STORAGE_KEYS = {
    LANG: "lang",
    DEBUG_MODE: "debugMode",
    HEALTHCHECKS_HISTORY: "healthchecksHistory",
} as const;

export const SEARCH_PARAMS = {
    LANG: "hl",
} as const;

export const ROUTES = {
    HOME: "/",
    PROXY: <T extends string>(url: T) => `https://proxy.tako.id?url=${encodeURIComponent(url)}` as const,
} as const;

export const API_ROUTES = {
    LIST_HEALTH_CHECKS: ROUTES.PROXY(`https://api.cloudflare.com/client/v4/zones/${CONFIGS.CF_ZONE_ID}/healthchecks`),
    GRAPHQL_QUERY: ROUTES.PROXY("https://api.cloudflare.com/client/v4/graphql"),
} as const;
