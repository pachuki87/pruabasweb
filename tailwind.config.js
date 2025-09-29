/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        accent: 'var(--accent-color)',
        warning: 'var(--warning-color)',
        error: 'var(--error-color)',
        success: 'var(--success-color)',
<<<<<<< HEAD
        'lidera-light-blue': '#7ba7d1',
=======
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
      },
    },
  },
  plugins: [],
}
