import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Times New Roman'", "Times", "serif"],
        mono: ["var(--font-mono)", "'Courier New'", "monospace"],
      },
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        canvas: "rgb(var(--canvas) / <alpha-value>)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
