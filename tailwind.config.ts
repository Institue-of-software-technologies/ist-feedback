import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    'node_modules/preline/dist/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff", // Set a specific color for background
        foreground: "#000000", // Set a specific color for foreground/text
      },
    },
  },
  plugins: [
    require('preline/plugin'),
  ],
};

export default config;
