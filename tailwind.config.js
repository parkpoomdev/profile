/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Light Mode Colors
        'primary-text': 'rgb(24, 24, 27)',
        'secondary-text': 'rgb(107, 114, 128)',
        'primary-bg': 'rgb(255, 255, 255)',
        
        // Dark Mode Colors (Tech Aesthetic)
        'dark-text': 'rgb(248, 250, 252)',
        'dark-bg': 'rgb(15, 23, 42)',
        
        // New Accent Color (Vibrant Electric Blue)
        'tech-accent': 'rgb(0, 150, 255)',
      }
    }
  },
  plugins: [],
}

