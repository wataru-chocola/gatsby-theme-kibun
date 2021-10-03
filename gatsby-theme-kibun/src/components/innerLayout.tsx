import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar } from '@material-ui/core';
import { Container, ContainerProps } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import { Hidden } from '@material-ui/core';

import { AppBar, SiteTitle, MenuButton, SearchBox } from './appbar';
import { AccountButton } from './accountButton';
import { LogInButton } from './logInButton';
import { SideBarDrawer, MobileDrawer } from './sidebar';
import { SectionNavigationList } from './sectionNavigationList';
import { SnackMessage } from './snackMessage';
import ErrorBoundary from './errorboundary';

import { useAppSelector } from '../state/hooks';
import { selectIsLoggedIn } from '../state/loginSelector';

const drawerWidth = 240;

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
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
  },
}));

export type InnerLayoutProps = {
  window?: () => Window;
} & Pick<ContainerProps, 'children'>;

const InnerLayout: React.FC<InnerLayoutProps> = ({ window, children }) => {
  const classes = useStyles();
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);
  const container = window !== undefined ? () => window().document.body : undefined;
  const isLoggedIn = useAppSelector((state) => selectIsLoggedIn(state));

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <div className={classes.root}>
      <SnackMessage />
      <AppBar className={classes.appBar}>
        <MenuButton className={classes.menuButton} onClick={handleDrawerToggle} />
        <SiteTitle />
        <div className={classes.grow} />
        <SearchBox />
        {isLoggedIn ? <AccountButton /> : <LogInButton />}
      </AppBar>

      <nav aria-label="sidemenu">
        <Hidden smUp implementation="css">
          <MobileDrawer
            container={container}
            className={classes.drawer}
            classes={{
              paper: classes.drawerPaper,
            }}
            open={mobileDrawerOpen}
            onClose={handleDrawerToggle}
          >
            <SectionNavigationList />
          </MobileDrawer>
        </Hidden>

        <Hidden xsDown implementation="css">
          <SideBarDrawer
            className={classes.drawer}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <SectionNavigationList />
          </SideBarDrawer>
        </Hidden>
      </nav>

      <main className={classes.content}>
        <Toolbar />
        <Container maxWidth="md" fixed disableGutters>
          <ErrorBoundary fallback={<h1>Error: Something wrong happened (&gt;&lt;)</h1>}>
            <Paper>{children}</Paper>
          </ErrorBoundary>
        </Container>
      </main>
    </div>
  );
};

export default InnerLayout;
