import { defineConfig } from "@solidjs/start/config";

import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = dirname(__filename);

export default defineConfig({
    ssr: false,
    vite: {
        define: {
            "import.meta.env.PROD": process.env.NODE_ENV === "production",
        },
        resolve: {
            alias: {
                "@": resolve(__dirname, "src"),
            },
        },
        plugins: [],
    },
    server: {
        preset: "static",
        static: true,
    },
});
