/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
        colors: {
            logoGreen: {
                dark: '#28914f',
                light: '#a3cfb6'
            }
        },
        fontFamily: {
            sans: ['Helvetica LT', 'Helvetica', 'Arial', 'sans-serif'],
            'helvetica-black': ['Helvetica Black Oblique', 'Helvetica', 'Arial', 'sans-serif'],
        }
    },
  },
  plugins: [],
}

