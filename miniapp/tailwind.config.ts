import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        arena: {
          bg: "#0a0a0a",
          fg: "#fafafa",
          muted: "#a1a1aa",
          accent: "#3b82f6",
        },
      },
    },
  },
  plugins: [],
};
export default config;
