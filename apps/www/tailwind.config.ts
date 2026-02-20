import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./registry/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        // Points animation keyframes
        "points-float": {
          "0%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(-50px) scale(1.2)",
          },
        },
        "points-pop": {
          "0%": {
            opacity: "0",
            transform: "scale(0.5)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.3)",
          },
          "100%": {
            opacity: "0",
            transform: "scale(1)",
          },
        },
        "points-slide": {
          "0%": {
            opacity: "1",
            transform: "translateX(0)",
          },
          "100%": {
            opacity: "0",
            transform: "translateX(30px)",
          },
        },
      },
      animation: {
        "points-float": "points-float 1s ease-out forwards",
        "points-pop": "points-pop 1s ease-out forwards",
        "points-slide": "points-slide 1s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
