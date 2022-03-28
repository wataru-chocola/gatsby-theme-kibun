import React from 'react';
import { Box, Toolbar, SwipeableDrawer } from '@mui/material';
import { useMediaQuery, useTheme, Breakpoint } from '@mui/material';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

import { Attachments } from './attachments';

interface Props {
  openState: boolean;
  toggle: (open?: boolean) => () => void;
  breakpoint?: Breakpoint;
}

const RightPanelShell: React.FC<Props> = (props) => {
  const theme = useTheme();
  const temporary = useMediaQuery(theme.breakpoints.down(props.breakpoint || 'lg'), {
    noSsr: true,
  });

  const evtHandlerTogglePanel =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      props.toggle(open)();
    };
  return temporary ? (
    <SwipeableDrawer
      variant="temporary"
      anchor="right"
      open={props.openState}
      onOpen={evtHandlerTogglePanel(true)}
      onClose={evtHandlerTogglePanel(false)}
      keepMounted={true}
    >
      <Box
        height="100%"
        width="350px"
        left="auto"
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        {props.children}
      </Box>
    </SwipeableDrawer>
  ) : (
    <Box width="350px" sx={{ flexShrink: 0 }}>
      <Box
        height="100%"
        width="350px"
        position="fixed"
        left="auto"
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        {props.children}
      </Box>
    </Box>
  );
};
RightPanelShell.displayName = 'RightPanelShell';

export const RightPanel: React.VFC<Props> = (props) => {
  return (
    <RightPanelShell {...props}>
      <Toolbar />
      <OverlayScrollbarsComponent
        options={{
          className: 'os-theme-dark os-theme-custom os-host-flexbox',
          scrollbars: {
            clickScrolling: true,
          },
        }}
      >
        <Attachments />
      </OverlayScrollbarsComponent>
    </RightPanelShell>
  );
};
RightPanel.displayName = 'RightPanel';
