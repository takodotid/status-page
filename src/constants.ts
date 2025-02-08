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
        return import.meta.env.PROD ? "G-Z2CX9LLGE0" : undefined;
    },
} as const;

export const LOCAL_STORAGE_KEYS = {
    LANG: "lang",
    DEBUG_MODE: "debugMode",
} as const;

export const SEARCH_PARAMS = {
    LANG: "hl",
} as const;

export const ROUTES = {
    HOME: "/",
} as const;

export const API_ROUTES = {} as const;
