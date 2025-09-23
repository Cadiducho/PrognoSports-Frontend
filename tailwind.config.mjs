/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // PALETA PRINCIPAL (Brand)
        brand: {
          50: '#F5F0FA',
          100: '#EBE1F5',
          200: '#D7C3EB',
          300: '#C3A5E1',
          400: '#A18ACC',
          500: '#693BA7', // Base (hsl(268, 48%, 45%))
          600: '#5D34A0',
          700: '#4C2B7A',
          800: '#3A215E',
          900: '#281742',
          accent: {
            50: '#F8F2FE',
            100: '#F0E4FD',
            200: '#E1CAFB',
            300: '#D2AFF9',
            400: '#C395F7',
            500: '#8E4AEC', // Base (hsl(268, 82%, 64%))
            600: '#7E3EDB',
            700: '#6636AA',
            800: '#4D2980',
            900: '#331B56'
          }
        },

        // PALETA SECUNDARIA (Análoga)
        secondary: {
          50: '#F1EDF9',
          100: '#E3DAF2',
          200: '#C8B6E5',
          300: '#AC91D8',
          400: '#916DCB',
          500: '#7548BE', // Base (hsl(263, 48%, 52%))
          600: '#643CAD',
          700: '#4E2F87',
          800: '#382361',
          900: '#22163B'
        },

        // PALETA TERCIARIA (Triada 120°)
        tertiary: {
          50: '#F0FDF5',
          100: '#DCFCE8',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E', // Base (hsl(152, 72%, 44%))
          600: '#1EAD54',
          700: '#198744',
          800: '#136133',
          900: '#0E3B22',
          accent: {
            50: '#F0FDF9',
            100: '#C6FAE8',
            200: '#8DF5D1',
            300: '#5AEFBA',
            400: '#2CE4A0',
            500: '#4AE8A8', // Base (hsl(158, 76%, 60%))
            600: '#3BD198',
            700: '#2FA97D',
            800: '#238162',
            900: '#175947'
          }
        },

        // COLORES DE CONTRASTE
        contrast: {
          primary: { // Dorado (Complementario)
            50: '#FFFDF2',
            100: '#FFFBE6',
            200: '#FFF6C2',
            300: '#FFF099',
            400: '#FFEA66',
            500: '#FFD700', // Base (hsl(51, 100%, 50%))
            600: '#E6C200',
            700: '#B39600',
            800: '#806D00',
            900: '#4D4200'
          },
          secondary: { // Cian (Split-Complementario)
            50: '#F0FDFD',
            100: '#E0FAFA',
            200: '#B8F4F4',
            300: '#7EEBEB',
            400: '#2DD4D4',
            500: '#00FFFF', // Base (hsl(180, 100%, 50%))
            600: '#00E6E6',
            700: '#00B3B3',
            800: '#008080',
            900: '#004D4D'
          }
        },

        // PALETAS COMPLEMENTARIAS
        pink: {
          50: '#FDF2F9',
          100: '#FCE6F3',
          200: '#FAC8E3',
          300: '#F89BCE',
          400: '#F565B3',
          500: '#EC4899', // Base (hsl(333, 81%, 60%))
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843'
        },

        // SEMÁNTICOS
        success: {
          DEFAULT: '#22c55e',
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          DEFAULT: '#eab308',
          50:  '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        error: {
          DEFAULT: '#ef4444',
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        info: {
          DEFAULT: '#3b82f6',
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },

        // SISTEMA DE GRISES
        gray: {
          light: { // Modo claro (neutral)
            50: '#FAFAFA',
            100: '#F5F5F5',
            200: '#E5E5E5',
            300: '#D4D4D4',
            400: '#A3A3A3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717'
          },
          dark: { // Modo oscuro (con matiz morado)
            50: '#F5F3F9',
            100: '#EAE6F2',
            200: '#D5CCE5',
            300: '#C0B3D8',
            400: '#AB99CB',
            500: '#8A76A8',
            600: '#6E5D8A',
            700: '#53456B',
            800: '#372C47',
            900: '#1C1623'
          },
          purpleGray: { // Grises con matiz morado
            50: '#F7F5FA',
            100: '#EFEBF5',
            200: '#DFD7EB',
            300: '#CFC3E1',
            400: '#BFAFD7',
            500: '#9F8BBE',
            600: '#7F6F9A',
            700: '#5F5376',
            800: '#3F3851',
            900: '#201C2B'
          }
        }
      }
    }
  },
}
