/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },

      colors: {
        background: "#020617",
        foreground: "#F8FAFC",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};