import React from 'react';

import { Drawer, DrawerProps } from '@mui/material';
import { Box, Toolbar } from '@mui/material';

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
      <Box sx={{ overflow: 'auto' }}>{props.children}</Box>
    </Drawer>
  );
};
