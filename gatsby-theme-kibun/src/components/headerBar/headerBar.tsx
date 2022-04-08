import React from 'react';

import { Box, AppBar, Toolbar, MenuProps } from '@mui/material';
import { Divider } from '@mui/material';
import { useScrollTrigger } from '@mui/material';

import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { HamburgerButton } from './hamburgerButton';
import { MenuButton } from '../uiparts/menuButton';
import { SiteTitle } from './siteTitle';
import { SearchBox } from './searchBox';
import { LogInButton } from './logInButton';
import { Flipcard } from '../uiparts/flipcard';

import { useAppSelector } from '../../state/hooks';
import { selectIsLoggedIn } from '../../state/loginSelector';

type HeaderBarProps<P extends MenuProps = MenuProps> = {
  onHamburgerButton: () => void;
  pageTitle: string;
  menu: React.VFC<P>;
  menuExtraProps?: P;
};

export function HeaderBar<P extends MenuProps = MenuProps>(
  props: HeaderBarProps<P>,
): React.ReactElement {
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
          <HamburgerButton onClick={props.onHamburgerButton} edge="start" />
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
            <MenuButton
              menuId="account-menu"
              icon={<AccountCircle />}
              menu={props.menu}
              menuExtraProps={props.menuExtraProps}
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
            />
          ) : (
            <React.Fragment>
              <MenuButton
                menuId="action-menu"
                icon={<MoreVertIcon />}
                menu={props.menu}
                menuExtraProps={props.menuExtraProps}
                aria-label="open action menu"
                aria-haspopup="true"
              />
              <Box width={8} display={{ xs: 'none', md: 'inline-block' }} />
              <LogInButton />
            </React.Fragment>
          )}
        </Box>
      </Toolbar>

      <Divider variant="middle" />
    </AppBar>
  );
}
