import React from 'react';
import { createTheme } from '@mui/material/styles';
import { jaJP } from '@mui/material/locale';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

const fontFamily = [
  '"Helvetica Neue"',
  'Arial',
  '"Hiragino Kaku Gothic ProN"',
  '"Hiragino Sans"',
  '"Meiryo UI"',
  'sans-serif',
];

declare module '@mui/material/styles' {
  interface Palette {
    complementary: PaletteColor;
    gray: string[];
  }
  interface PaletteColor {
    main: string;
    contrastText: string;
    tint: string[];
    shade: string[];
  }
  interface PaletteOptions {
    complementary: PaletteColorOptions;
    gray: string[];
  }
  interface PaletteColorOptions {
    main: string;
    contrastText?: string;
    tint?: string[];
    shade?: string[];
  }
}

const theme = createTheme(
  {
    palette: {
      primary: {
        main: '#8BC34A',
        tint: ['#A8D277', '#C5E1A4', '#E2F0D1'],
        shade: ['#689237', '#456125', '#223012'],
        contrastText: '#fff',
      },
      secondary: {
        main: '#4A8BC3',
        tint: ['#77A8D2', '#A4C5E1', '#D1E2F0'],
        shade: ['#376892', '#254561', '#122230'],
      },
      complementary: {
        main: '#824AC3',
        tint: [],
        shade: [],
      },
      gray: [
        '#E2E2E2',
        '#C6C6C6',
        '#AAAAAA',
        '#8D8D8D',
        '#717171',
        '#555555',
        '#383838',
        '#1C1C1C',
      ],
      text: {
        primary: '#555555',
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
  },
  jaJP,
);

// eslint-disable-next-line
export default function wrapWithThemeProvider(element: JSX.Element | JSX.Element[]) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{element}</ThemeProvider>
    </StyledEngineProvider>
  );
}
