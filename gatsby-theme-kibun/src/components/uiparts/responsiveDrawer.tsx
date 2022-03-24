import React from 'react';

import { SwipeableDrawer, Drawer, DrawerProps, SxProps, Breakpoint } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';

interface Props {
  anchor?: DrawerProps['anchor'];
  drawerOpenState: boolean;
  toggleDrawer: (open?: boolean) => () => void;
  sx: SxProps;
  breakpoint?: Breakpoint;
}

export const ResponsiveDrawer: React.FC<Props> = (props) => {
  const theme = useTheme();
  const drawerTemporary = useMediaQuery(theme.breakpoints.down(props.breakpoint || 'md'), {
    noSsr: true,
  });

  const evtHandlerToggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      props.toggleDrawer(open)();
    };

  return drawerTemporary ? (
    <SwipeableDrawer
      variant="temporary"
      anchor={props.anchor}
      open={props.drawerOpenState}
      onOpen={evtHandlerToggleDrawer(true)}
      onClose={evtHandlerToggleDrawer(false)}
      keepMounted={true}
      sx={props.sx}
    >
      {props.children}
    </SwipeableDrawer>
  ) : (
    <Drawer variant="permanent" anchor={props.anchor} sx={props.sx}>
      {props.children}
    </Drawer>
  );
};
ResponsiveDrawer.displayName = 'ResponsiveDrawer';
