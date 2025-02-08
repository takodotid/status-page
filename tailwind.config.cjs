/* eslint-disable no-undef, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-var-requires */
// @ts-nocheck

const { fontFamily } = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = /** @satisfies {import('tailwindcss').Config} */ ({
    mode: "jit",
    content: [
        "./src/**/*.{js,ts,jsx,tsx}", //
    ],
    corePlugins: {
        fontFamily: false,
    },
    theme: {
        colors: {
            inherit: "inherit",
            transparent: "transparent",
            current: "currentColor",
            "semi-white": "rgba(253, 253, 253, 0.1)",
            white: "#FDFDFD",
            black: "#0F191E",
            yellow: "#F8DC61",
            blue: {
                primary: "#37A2EA",
                secondary: "#1086D5",
            },
            purple: {
                primary: "#C264EE",
                secondary: "#A645D3",
            },
            pink: {
                primary: "#EA76AE",
                secondary: "#F4489B",
            },
            red: {
                primary: "#EC4C4F",
                secondary: "#DD3639",
            },
            green: {
                primary: "#4EBD77",
                secondary: "#3A9C5E",
            },
            grayscale: {
                10: "#A6ABAC",
                20: "#6C7376",
                30: "#313B40",
                40: "#29373D",
                50: "#1A2B32",
            },
        },
        fontFamily: {
            nunito: ["Nunito", ...fontFamily.sans],
        },
        screens: {
            xs: "360px",
            md: "768px",
            lg: "1024px",
            xl: "1200px",
            "2xl": "1440px",
        },
        container: {
            center: true,
            screens: {
                md: "896px",
                lg: "1024px",
            },
        },
        borderWidth: {
            0: "0px",
            DEFAULT: "0.0625rem",
            2: "0.125rem",
            4: "0.25rem",
            6: "0.375rem",
            8: "0.5rem",
        },
        extend: {
            strokeWidth: {
                1.5: "1.5px",
            },
            borderRadius: {
                "4.5xl": "2.5rem",
            },
            textStroke: {
                1: "1px",
                3: "3px",
            },
            textShadow: {
                0: "0px",
                5: "5px",
                8: "8px",
            },
            boxShadow: {
                trail: "0.25rem 0.25rem 0 0 var(--tw-shadow-color)",
                "trail-half": "0.125rem 0.125rem 0 0 var(--tw-shadow-color)",
            },
        },
    },
    plugins: [
        plugin(({ theme, addBase, addUtilities, matchUtilities, addComponents, addVariant }) => {
            addVariant("**", "& *");

            // Make all fonts have it's own CSS Variable (e.g. --font-nunito)
            addBase({
                ":root": Object.fromEntries(
                    Object.entries(theme("fontFamily")).map(([key, value]) => [
                        `--font-${key}`, //
                        Array.isArray(value) ? value.join(", ") : value,
                    ])
                ),
            });

            // Replace default font-* classes
            // Every font-* class will be replaced with `font-family: var(--font-*)`
            matchUtilities(
                {
                    font: (value) => ({
                        "--font-family": `var(--font-${value})`,
                        "font-family": `var(--font-family, var(--font-nunito))`,
                    }),
                },
                {
                    values: Object.keys(theme("fontFamily")).reduce((acc, key) => {
                        acc[key] = [key];
                        return acc;
                    }, {}),
                }
            );

            // Utilities Classes
            addUtilities({
                ".skeleton": {
                    "@apply relative overflow-hidden rounded-full bg-semi-white animate-pulse": {},
                    "&:after": {
                        "@apply absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer": {},
                        content: '""',
                    },
                },

                ".hoverable": {
                    "@apply cursor-pointer duration-200 hover:opacity-75": {},
                },

                ".hidden-input": {
                    "@apply absolute bottom-0 left-0 h-1 w-full opacity-0": {},
                },
            });

            // Text Style
            addComponents({
                ".ts-jumbo": {
                    "@apply text-[4rem] leading-[64px] lg:text-[5rem] lg:leading-[96px]": {},
                    "font-family": "var(--font-family, var(--font-nunito))",
                },

                ".ts-h1": {
                    "@apply text-[2.25rem] leading-[40px] lg:text-[3rem] lg:leading-[56px]": {},
                    "font-family": "var(--font-family, var(--font-nunito))",
                },
                ".ts-h2": {
                    "@apply text-[2rem] leading-[44px] lg:text-[2.25rem] lg:leading-[48px]": {},
                    "font-family": "var(--font-family, var(--font-nunito))",
                },
                ".ts-h3": {
                    "@apply text-[1.75rem] leading-[2.5rem] lg:text-[2rem] lg:leading-[2.75rem]": {},
                    "font-family": "var(--font-family, var(--font-nunito))",
                },

                ".ts-2xl": {
                    "@apply text-2xl leading-8": {},
                    "font-family": "var(--font-family, var(--font-nunito))",
                },
                ".ts-xl": {
                    "@apply text-xl leading-7": {},
                    "font-family": "var(--font-family, var(--font-nunito))",
                },
                ".ts-lg": {
                    "@apply text-lg leading-6": {},
                    "font-family": "var(--font-family, var(--font-nunito))",
                },
                ".ts-base": {
                    "@apply text-base leading-6": {},
                    "font-family": "var(--font-family, var(--font-nunito))",
                },
                ".ts-sm": {
                    "@apply text-sm leading-5": {},
                    "font-family": "var(--font-family, var(--font-nunito))",
                },
                ".ts-xs": {
                    "@apply text-xs leading-4": {},
                    "font-family": "var(--font-family, var(--font-nunito))",
                },
            });
        }),
    ],
});
