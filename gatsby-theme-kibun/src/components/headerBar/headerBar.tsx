import React from 'react';

import { Box, AppBar, Toolbar } from '@mui/material';
import { Divider } from '@mui/material';

import { MenuButton } from './menuButton';
import { SiteTitle } from './siteTitle';
import { SearchBox } from './searchBox';
import { AccountButton } from './accountButton';
import { LogInButton } from './logInButton';

import { useAppSelector } from '../../state/hooks';
import { selectIsLoggedIn } from '../../state/loginSelector';

export const HeaderBar: React.VFC<{ onMenuButton: () => void }> = (props) => {
  const isLoggedIn = useAppSelector((state) => selectIsLoggedIn(state));

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
            marginRight: 2,
            display: {
              sm: 'none',
            },
          }}
        >
          <MenuButton onClick={props.onMenuButton} />
        </Box>
        <Box mb={1} alignSelf="flex-end" sx={{ display: { xs: 'none', sm: 'block' } }}>
          <SiteTitle />
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box mt={1} mb={1} mr={2} ml={{ sm: 3, xs: 0 }}>
          <SearchBox />
        </Box>
        {isLoggedIn ? <AccountButton /> : <LogInButton />}
      </Toolbar>
      <Divider variant="middle" />
    </AppBar>
  );
};
