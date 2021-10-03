import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar } from '@material-ui/core';
import { Container, ContainerProps } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import { Hidden } from '@material-ui/core';

import { HeaderBar } from './headerbar';
import { SideBarDrawer, MobileDrawer } from './sidebar';
import { SectionNavigationList } from './sectionNavigationList';
import { SnackMessage } from './snackMessage';
import ErrorBoundary from './errorboundary';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
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

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <div className={classes.root}>
      <SnackMessage />
      <HeaderBar onMenuButton={handleDrawerToggle} />

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
