// File: app.config.ts
// App-wide configuration and theme settings

export default defineAppConfig({
  // App name and details
  name: 'Obiabedidi',
  description: 'Ghanaian Recipe Web App',
  
  // Theme configuration using Ghana flag colors
  theme: {
    colors: {
      primary: {
        50: '#FBEAED',
        100: '#F7D6DB',
        200: '#EFACB7',
        300: '#E78394',
        400: '#DF5970',
        500: '#CE1126', // Ghana flag red
        600: '#A50E1E',
        700: '#7C0A17',
        800: '#52070F',
        900: '#290308',
      },
      secondary: {
        50: '#FFFAED',
        100: '#FFF4DA',
        200: '#FEE9B6',
        300: '#FDDE91',
        400: '#FCD86D',
        500: '#FCD116', // Ghana flag yellow
        600: '#CFA705',
        700: '#9C8004',
        800: '#685502',
        900: '#342B01',
      },
      tertiary: {
        50: '#E6F2ED',
        100: '#CCE6DC',
        200: '#99CCB9',
        300: '#66B396',
        400: '#339973',
        500: '#006B3F', // Ghana flag green
        600: '#005632',
        700: '#004026',
        800: '#002B19',
        900: '#00150D',
      },
    },
    // Round values used in the UI
    borderRadius: {
      sm: '0.25rem',
      DEFAULT: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      '2xl': '1.5rem',
      full: '9999px',
    },
  },
}) 