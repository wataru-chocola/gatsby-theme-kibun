import React from 'react';

import { Drawer, DrawerProps } from '@mui/material';
import { Box, Toolbar } from '@mui/material';
import { alpha } from '@mui/material/styles';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

export const MobileDrawer: React.FC<DrawerProps> = (props) => {
  return (
    <Drawer variant="temporary" {...props}>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>{props.children}</Box>
    </Drawer>
  );
};

export const SideBarDrawer: React.FC<DrawerProps> = (props) => {
  return (
    <Drawer variant="permanent" {...props}>
      <Toolbar />
      <OverlayScrollbarsComponent
        options={{
          className: 'os-theme-dark os-theme-custom os-host-flexbox',
          scrollbars: {
            clickScrolling: true,
          },
        }}
      >
        {props.children}
      </OverlayScrollbarsComponent>
    </Drawer>
  );
};
