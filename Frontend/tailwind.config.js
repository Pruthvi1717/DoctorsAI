/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        muted: "var(--muted)",
        accent: "var(--accent)",
        teal: "var(--teal)",
      },
    },
  },
  plugins: [],
};

