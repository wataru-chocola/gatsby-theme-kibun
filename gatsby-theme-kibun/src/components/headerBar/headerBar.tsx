import React from 'react';

import { Box, AppBar, Toolbar } from '@mui/material';
import { Divider } from '@mui/material';
import { useScrollTrigger } from '@mui/material';

import { MenuButton } from './menuButton';
import { ActionButton } from './actionButton';
import { SiteTitle } from './siteTitle';
import { SearchBox } from './searchBox';
import { AccountButton } from './accountButton';
import { LogInButton } from './logInButton';
import { Flipcard } from '../utils/flipcard';

import { useAppSelector } from '../../state/hooks';
import { selectIsLoggedIn } from '../../state/loginSelector';

export const HeaderBar: React.VFC<{ onMenuButton: () => void; pageTitle: string }> = (props) => {
  const isLoggedIn = useAppSelector((state) => selectIsLoggedIn(state));
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 50 });

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
          <MenuButton onClick={props.onMenuButton} edge="start" />
        </Box>
        <Box
          alignSelf="center"
          sx={{
            flexGrow: 1,
            overflow: 'hidden',
          }}
        >
          <Flipcard
            reversed={scrolled}
            front={<SiteTitle />}
            back={
              <Box
                sx={{
                  color: 'primary.main',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  width: '100%',

                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {props.pageTitle}
              </Box>
            }
          />
        </Box>
        <Box width={16} flexShrink={0} />
        <Box mt={1} mb={1} mr={2} ml={{ sm: 3, xs: 0 }} display={{ sm: 'block', xs: 'none' }}>
          <SearchBox />
        </Box>
        <Box sx={{ flexShrink: 0, alignSelf: 'center' }}>
          {isLoggedIn ? (
            <AccountButton />
          ) : (
            <React.Fragment>
              <LogInButton />
              <Box width={8} display="inline-block" />
              <ActionButton edge="end" />
            </React.Fragment>
          )}
        </Box>
      </Toolbar>

      <Divider variant="middle" />
    </AppBar>
  );
};
HeaderBar.displayName = 'HeaderBar';
