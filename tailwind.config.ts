import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./config/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Aegean Coastal Editorial palette (extracted from the logo) ---
        sea: {
          DEFAULT: "#09A7AA", // --sea-teal — primary accent
          deep: "#067A7D", // --sea-teal-deep — hover / pressed
          wash: "#E4F4F4", // --sea-teal-wash — tinted backgrounds, skeletons
        },
        ink: {
          DEFAULT: "#2D2A31", // headings, product names
          soft: "#4A464E", // body / descriptions
          muted: "#8B8690", // metadata, allergens, placeholders
        },
        sand: "#F5EFE6", // main app background
        shell: "#FBF8F3", // sticky bars, elevated surfaces
        foam: "#FFFFFF", // product cards, inputs
        line: "#E8E0D4", // borders, dividers
        coral: "#E8825A", // featured badge only
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        warm: "0 6px 20px rgba(45,42,49,0.06)",
        "warm-lg": "0 12px 32px rgba(45,42,49,0.10)",
      },
      borderRadius: {
        "2xl": "1rem",
      },
      maxWidth: {
        phone: "480px",
      },
      keyframes: {
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "toast-in": "toast-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
