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
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#1FBBE8",
          50: "#E8F8FD",
          100: "#CCEFFA",
          200: "#99DFF5",
          300: "#66CFF0",
          400: "#33C0EC",
          500: "#1FBBE8",
          600: "#1697BA",
          700: "#0E738B",
          800: "#074F5D",
          900: "#032B33",
        },
        ink: {
          950: "#06080B",
          900: "#0B0F14",
          850: "#0F141B",
          800: "#141A22",
          700: "#1B2230",
          600: "#252E3F",
          500: "#37425A",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(31,187,232,0.25), 0 8px 40px -8px rgba(31,187,232,0.45)",
        soft: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.5)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at center, rgba(31,187,232,0.08), transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
