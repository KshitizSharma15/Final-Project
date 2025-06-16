/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';

export default {
    darkMode: ['selector', '[class="app-dark"]'],
    content: ['./src/**/*.{html,ts,scss,css}', './index.html'],
    plugins: [
        PrimeUI,
        function ({ addUtilities }) {
            addUtilities({
              '.scrollbar-hide': {
                /* For Chrome, Safari, and Opera */
                '::-webkit-scrollbar': {
                  display: 'none',
                },
      
                /* For Firefox */
                'scrollbar-width': 'none', /* "auto" or "thin" */
              },
            });
          },
    ],
    theme: {
        screens: {
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            '2xl': '1920px'
        }
    }
};
