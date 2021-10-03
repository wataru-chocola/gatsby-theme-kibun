import React from 'react';

import { AppBar, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { MenuButton } from './menuButton';
import { SiteTitle } from './siteTitle';
import { SearchBox } from './searchBox';
import { AccountButton } from './accountButton';
import { LogInButton } from './logInButton';

import { useAppSelector } from '../../state/hooks';
import { selectIsLoggedIn } from '../../state/loginSelector';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  grow: {
    flexGrow: 1,
  },
}));

export const HeaderBar: React.VFC<{ onMenuButton: () => void }> = (props) => {
  const classes = useStyles();
  const isLoggedIn = useAppSelector((state) => selectIsLoggedIn(state));

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <MenuButton className={classes.menuButton} onClick={props.onMenuButton} />
        <SiteTitle />
        <div className={classes.grow} />
        <SearchBox />
        {isLoggedIn ? <AccountButton /> : <LogInButton />}
      </Toolbar>
    </AppBar>
  );
};
