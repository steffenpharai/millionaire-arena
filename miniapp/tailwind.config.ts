import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        arena: {
          bg: "var(--bg)",
          "bg-card": "var(--bg-card)",
          fg: "var(--fg)",
          muted: "var(--muted)",
          accent: "var(--accent)",
          "accent-gold": "var(--accent-gold)",
          "accent-emerald": "var(--accent-emerald)",
          "accent-amber": "var(--accent-amber)",
          "accent-violet": "var(--accent-violet)",
        },
      },
      backgroundImage: {
        "arena-hero": "var(--gradient-hero)",
        "arena-ladder": "var(--gradient-ladder)",
      },
      boxShadow: {
        "arena-card": "var(--shadow-card)",
      },
    },
  },
  plugins: [],
};
export default config;
