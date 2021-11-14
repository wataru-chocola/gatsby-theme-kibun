import React from 'react';

import { Box, AppBar, Toolbar } from '@mui/material';

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
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <MenuButton
          onClick={props.onMenuButton}
          sx={{
            marginRight: 2,
            display: {
              sm: 'none',
            },
          }}
        />
        <SiteTitle />
        <Box sx={{ flexGrow: 1 }} />
        <SearchBox />
        {isLoggedIn ? <AccountButton /> : <LogInButton />}
      </Toolbar>
    </AppBar>
  );
};
