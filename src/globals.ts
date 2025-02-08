import { DEV } from "solid-js";

import { LOCAL_STORAGE_KEYS } from "@/constants";

/**
 * Enable debug mode
 * Can be accessed from the console by typing `enableDebug`
 */
Object.defineProperty(window, "enableDebug", {
    get() {
        localStorage.setItem(LOCAL_STORAGE_KEYS.DEBUG_MODE, "true");
        return "Debug mode is enabled!";
    },
    configurable: false,
    enumerable: false,
});

/**
 * Disable debug mode
 * Can be accessed from the console by typing `disableDebug`
 */
Object.defineProperty(window, "disableDebug", {
    get() {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.DEBUG_MODE);
        return "Debug mode is disabled!";
    },
    configurable: false,
    enumerable: false,
});

/**
 * Check if the debug mode is enabled
 * Can be accessed from the console by typing `isDebugging`
 * While in development mode, this will always return `true`
 */
Object.defineProperty(window, "isDebugging", {
    get() {
        return localStorage.getItem(LOCAL_STORAGE_KEYS.DEBUG_MODE) === "true";
    },
    configurable: false,
    enumerable: false,
});

/**
 * Enable debug mode by default in development mode
 */
if (DEV) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.DEBUG_MODE, "true");
}

export {};
