import React from 'react';
import { Box, Toolbar, SwipeableDrawer, IconButton } from '@mui/material';
import { useMediaQuery, useTheme, Breakpoint } from '@mui/material';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  openState: boolean;
  toggle: (open?: boolean) => () => void;
  breakpoint?: Breakpoint;
  width?: string | number;
}

const RightPanelShell: React.FC<Props> = (props) => {
  const width = props.width || '350px';
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
        width={width}
        left="auto"
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        {props.children}
      </Box>
    </SwipeableDrawer>
  ) : (
    <Box width={width} sx={{ flexShrink: 0 }}>
      <Box
        height="100%"
        width={width}
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

export const RightPanelLayout: React.FC<Props> = ({ children, ...props }) => {
  const theme = useTheme();
  const temporary = useMediaQuery(theme.breakpoints.down(props.breakpoint || 'lg'), {
    noSsr: true,
  });

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
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={props.toggle(false)}
            sx={{
              display: temporary ? 'span' : 'none',
              position: 'absolute',
              top: (theme) => theme.spacing(2),
              right: (theme) => theme.spacing(2),
            }}
          >
            <CloseIcon />
          </IconButton>

          {children}
        </Box>
      </OverlayScrollbarsComponent>
    </RightPanelShell>
  );
};
RightPanelLayout.displayName = 'RightPanelLayout';
