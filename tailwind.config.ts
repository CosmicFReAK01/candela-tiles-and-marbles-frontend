import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        candela: {
          bg: "var(--bg-primary)",           // #F8F5F0 (warm ivory)
          surface: "var(--bg-surface)",      // #EDEBE6 (stone)
          text: "var(--text-primary)",       // #1A1A1A (near-black)
          secondary: "var(--text-secondary)",// #5C5A55 (charcoal)
          accent: "var(--accent-bronze)",    // #8B6914 (bronze/gold)
          dark: "var(--bg-dark)",            // #2A2825 (deep brown)
          border: "var(--border-muted)",     // #D4D0C8 (muted)
        },
      },
      fontFamily: {
        heading: ["var(--font-cormorant)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      letterSpacing: {
        editorial: "-0.02em",
        architectural: "0.14em",
      },
    },
  },
  plugins: [],
};

export default config;
