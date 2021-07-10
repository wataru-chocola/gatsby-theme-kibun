import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

import Seo from './seo';
import theme from '../theme';

import InnerLayout, { InnerLayoutProps } from './innerLayout';

import './layout.css';

type LayoutProps = {
  pageTitle: string;
} & InnerLayoutProps;

const Layout: React.FC<LayoutProps> = ({ pageTitle, ...props }) => {
  return (
    <React.Fragment>
      <Seo title={pageTitle} />

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <InnerLayout {...props} />
      </ThemeProvider>
    </React.Fragment>
  );
};

export default Layout;
