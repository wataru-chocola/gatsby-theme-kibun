import React from 'react';
import { ResponsiveDrawer } from '../uiparts/responsiveDrawer';
import { Toolbar } from '@mui/material';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

interface Props {
  openState: boolean;
  toggle: (open?: boolean) => void;
  width?: string | number;
}

export const SidebarLayout: React.FC<Props> = (props) => {
  const drawerWidth = props.width || 300;
  const drawerSx = {
    width: {
      sm: drawerWidth,
    },
    flexShrink: {
      sm: 0,
    },
    '& .MuiDrawer-paper': {
      width: drawerWidth,
    },
  } as const;

  return (
    <ResponsiveDrawer
      openState={props.openState}
      toggle={props.toggle}
      breakpoint="md"
      sx={drawerSx}
    >
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
    </ResponsiveDrawer>
  );
};
SidebarLayout.displayName = 'SidebarLayout';
