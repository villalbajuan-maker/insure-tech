import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#102033",
        mist: "#eef3f8",
        coral: "#ff7a59",
        tide: "#0f766e",
        sand: "#f8f1e7"
      },
      boxShadow: {
        card: "0 20px 45px rgba(16, 32, 51, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
