/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        virgil: ["Virgil", "sans-serif"],
        exo: ['Exo 2', "sans-serif"]
        
      },
      colors: {
        "c-dark-1": "#131717",
        "c-dark-2" : "#18181b",
        
      },
    },
  },
  plugins: [require("daisyui")],
};
