import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        arena: {
          bg: "var(--bg)",
          fg: "var(--fg)",
          muted: "var(--muted)",
          accent: "var(--accent)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
