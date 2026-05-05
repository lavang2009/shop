/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 10px 30px rgba(2, 6, 23, 0.10)",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at top left, rgba(236, 253, 245, 0.95), rgba(240, 249, 255, 0.9) 40%, rgba(255,255,255,1) 100%)",
      },
    },
  },
  plugins: [],
};
