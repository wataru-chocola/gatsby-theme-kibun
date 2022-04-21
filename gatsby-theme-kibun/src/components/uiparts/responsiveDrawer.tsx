import React from 'react';

import { SwipeableDrawer, Drawer, DrawerProps, SxProps, Breakpoint } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';

interface Props {
  anchor?: DrawerProps['anchor'];
  openState: boolean;
  toggle: (open?: boolean) => void;
  sx: SxProps;
  breakpoint?: Breakpoint;
}

export const ResponsiveDrawer: React.FC<Props> = ({ toggle, ...props }) => {
  const theme = useTheme();
  const drawerTemporary = useMediaQuery(theme.breakpoints.down(props.breakpoint || 'md'), {
    noSsr: true,
  });

  const isSkipKeys = React.useCallback((event: React.KeyboardEvent | React.MouseEvent) => {
    return (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    );
  }, []);

  const onOpen = React.useCallback(
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (isSkipKeys(event)) {
        return;
      }
      toggle(true);
    },
    [isSkipKeys, toggle],
  );

  const onClose = React.useCallback(
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (isSkipKeys(event)) {
        return;
      }
      toggle(false);
    },
    [isSkipKeys, toggle],
  );

  return drawerTemporary ? (
    <SwipeableDrawer
      variant="temporary"
      anchor={props.anchor}
      open={props.openState}
      onOpen={onOpen}
      onClose={onClose}
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
