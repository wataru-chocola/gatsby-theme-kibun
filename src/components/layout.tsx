import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Container, ContainerProps } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import { Hidden } from '@material-ui/core';

import Seo from './seo';
import theme from '../theme';

import { AppBar, SiteTitle, MenuButton, SearchBox, AccountButton } from './appbar';
import { SideBarDrawer, MobileDrawer, DrawerContent } from './sidebar';

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

type LayoutProps = {
  pageTitle: string;
  window?: () => Window;
} & Pick<ContainerProps, 'children'>;

const Layout: React.FC<LayoutProps> = ({ window, pageTitle, children }) => {
  const classes = useStyles();
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);
  const container = window !== undefined ? () => window().document.body : undefined;

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <React.Fragment>
      <Seo title={pageTitle} />

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={classes.root}>
          <AppBar className={classes.appBar}>
            <MenuButton className={classes.menuButton} onClick={handleDrawerToggle} />
            <SiteTitle />
            <div className={classes.grow} />
            <SearchBox />
            <AccountButton />
          </AppBar>

          <nav aria-label="sidemenu">
            <Hidden smUp implementation="css">
              <MobileDrawer
                container={container}
                classes={{
                  paper: classes.drawerPaper,
                }}
                open={mobileDrawerOpen}
                onClose={handleDrawerToggle}
              >
                <DrawerContent />
              </MobileDrawer>
            </Hidden>

            <Hidden xsDown implementation="css">
              <SideBarDrawer
                className={classes.drawer}
                classes={{
                  paper: classes.drawerPaper,
                }}
              >
                <DrawerContent />
              </SideBarDrawer>
            </Hidden>
          </nav>

          <main className={classes.content}>
            <Toolbar />
            <Container maxWidth="md" fixed disableGutters>
              <Paper>{children}</Paper>
            </Container>
          </main>
        </div>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default Layout;
