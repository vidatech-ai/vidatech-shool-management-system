import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#101B35",
        graphite: "#172033",
        cloud: "#F4F7FC",
        brand: {
          primary: "rgb(var(--brand-primary) / <alpha-value>)",
          secondary: "rgb(var(--brand-secondary) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
