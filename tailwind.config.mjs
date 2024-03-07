/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
    content: [
        './src/**/*.{vue,js,ts,jsx,tsx}'
    ],
    darkMode: 'class', // or 'media'
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#693BA7',
                    hover: colors.purple[600],
                },
                secondary: '#A484E5',
                contrast: {
                    DEFAULT: colors.slate[50],
                    dark: colors.gray[900]
                },
            },
        },
    },
}
