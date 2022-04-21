import React from 'react';

import { Box, MenuProps } from '@mui/material';
import { useScrollTrigger } from '@mui/material';

import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { MenuButton } from '../uiparts/menuButton';
import { SiteTitle } from './siteTitle';
import { SearchBox } from './searchBox';
import { LogInButton } from './logInButton';
import { Flipcard } from '../uiparts/flipcard';

import { useAppSelector } from '../../state/hooks';
import { selectIsLoggedIn } from '../../state/loginSelector';

type HeaderBarProps = {
  pageTitle: string;
  menuRender: (props: MenuProps) => React.ReactNode;
};

export function HeaderContent(props: HeaderBarProps): React.ReactElement {
  const isLoggedIn = useAppSelector((state) => selectIsLoggedIn(state));
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 50 });

  return (
    <Box display="flex">
      <Box alignSelf="center" flexGrow={1} overflow="hidden">
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
      <Box flexShrink={0} alignSelf="center">
        {isLoggedIn ? (
          <MenuButton
            menuId="account-menu"
            icon={<AccountCircle />}
            menuRender={props.menuRender}
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
          />
        ) : (
          <React.Fragment>
            <MenuButton
              menuId="action-menu"
              icon={<MoreVertIcon />}
              menuRender={props.menuRender}
              aria-label="open action menu"
              aria-haspopup="true"
            />
            <Box width={8} display={{ xs: 'none', md: 'inline-block' }} />
            <LogInButton />
          </React.Fragment>
        )}
      </Box>
    </Box>
  );
}
