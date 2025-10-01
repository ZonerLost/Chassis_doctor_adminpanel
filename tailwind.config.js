/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        brand: {
          black: "#0B0B0F",
          gray: "#12131A",
          card: "#161821",
          accent: "#9B59B6",
        },
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0,0,0,0.08)",
        strong: "0 8px 24px rgba(0,0,0,0.16)",
      },
    },
  },
  plugins: [],
};
