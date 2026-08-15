import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#F8FAFC",
          subtle: "#F1F5F9",
          blueTint: "#F0F7FF",
          card: "#FFFFFF",
          glass: "rgba(255, 255, 255, 0.85)",
        },
        skillora: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#172554",
        },
      },
      boxShadow: {
        "subtle": "0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)",
        "card": "0 4px 20px -2px rgba(37, 99, 235, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)",
        "glass": "0 8px 30px 0 rgba(37, 99, 235, 0.08)",
        "elevated": "0 20px 40px -15px rgba(37, 99, 235, 0.12)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
