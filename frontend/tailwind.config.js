/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          dark: "#121212",
          card: "#1E1E1E",
          green: "#10B981", // Emerald 500
          yellow: "#F59E0B", // Amber 500
          red: "#EF4444", // Red 500
          slate: "#1A1A1A" // Dark slate for backgrounds
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
