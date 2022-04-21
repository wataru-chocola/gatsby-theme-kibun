import React from 'react';

import { Box, AppBar, Toolbar } from '@mui/material';
import { Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { IconButton } from '../uiparts/iconButton';

type HeaderBarProps = {
  onHamburgerButton: () => void;
};

export const HeaderBarLayout: React.FC<HeaderBarProps> = (props) => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: 'white',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Box
          sx={{
            marginRight: { xs: 0, sm: 1 },
            alignSelf: 'center',
            display: {
              md: 'none',
            },
          }}
        >
          <IconButton aria-label="open drawer" onClick={props.onHamburgerButton} edge="start">
            <MenuIcon />
          </IconButton>
        </Box>
        <Box flexGrow="1">{props.children}</Box>
      </Toolbar>

      <Divider variant="middle" />
    </AppBar>
  );
};
HeaderBarLayout.displayName = 'HeaderBarLayout';
