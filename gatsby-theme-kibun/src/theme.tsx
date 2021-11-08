import React from 'react';
import { createTheme } from '@mui/material/styles';
//import { jaJP } from '@mui/material/locale';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';

const fontFamily = [
  '"Helvetica Neue"',
  'Arial',
  '"Noto Sans JP"',
  '"Hiragino Kaku Gothic ProN"',
  '"Hiragino Sans"',
  'Meiryo',
  'sans-serif',
];

const theme = createTheme({
  palette: {
    primary: {
      main: indigo[700],
    },
  },
  typography: {
    fontFamily: fontFamily.join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: '-0.035em',
    },
    h2: {
      fontSize: '1.65rem',
      fontWeight: 500,
      lineHeight: 1.6,
      letterSpacing: '-0.03em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontSize: '1.25rem',
      lineHeight: 1.5,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontSize: '1.15rem',
      lineHeight: 1.5,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontSize: '1.05rem',
      lineHeight: 1.5,
      letterSpacing: '-0.02em',
    },
    body1: {
      lineHeight: 1.7,
      letterSpacing: '0.05em',
    },
    caption: {
      fontSize: '0.85rem',
      lineHeight: 1.75,
      letterSpacing: '0.075em',
    },
  },
});

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

// eslint-disable-next-line
export default function wrapWithThemeProvider(element: JSX.Element | JSX.Element[]) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{element}</ThemeProvider>
    </StyledEngineProvider>
  );
}
