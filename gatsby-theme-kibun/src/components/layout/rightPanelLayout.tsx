import React from 'react';
import { Box, Toolbar, SwipeableDrawer, IconButton } from '@mui/material';
import { useMediaQuery, useTheme, Breakpoint } from '@mui/material';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  openState: boolean;
  toggle: (open?: boolean) => void;
  breakpoint?: Breakpoint;
  width?: string | number;
}

const RightPanelShell: React.FC<Props> = ({ toggle, ...props }) => {
  const width = props.width || '350px';
  const theme = useTheme();
  const temporary = useMediaQuery(theme.breakpoints.down(props.breakpoint || 'lg'), {
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

  return temporary ? (
    <SwipeableDrawer
      variant="temporary"
      anchor="right"
      open={props.openState}
      onOpen={onOpen}
      onClose={onClose}
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
  const toggle = props.toggle;
  const onClose = React.useCallback(() => toggle(false), [toggle]);

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
            onClick={onClose}
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
