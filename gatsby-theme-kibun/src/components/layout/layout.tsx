import React from 'react';
import { CssBaseline } from '@mui/material';

import Seo from '../utils/seo';
import InnerLayout, { InnerLayoutProps } from './innerLayout';

import './layout.css';

type LayoutProps = {
  pageTitle: string;
} & InnerLayoutProps;

const Layout: React.FC<LayoutProps> = ({ pageTitle, ...props }) => {
  return (
    <React.Fragment>
      <Seo title={pageTitle} />

      <CssBaseline />
      <InnerLayout pageTitle={pageTitle} {...props} />
    </React.Fragment>
  );
};

export default Layout;
