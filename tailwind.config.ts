import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: "#fff",
                fg: "#000",
                table_border: "#6B7280",
                table_text: "gray-500"
            },
        },
    },
    plugins: [],
} satisfies Config;
