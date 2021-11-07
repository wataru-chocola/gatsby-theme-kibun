import React, { useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Toolbar } from '@mui/material';
import { Container, ContainerProps } from '@mui/material';
import { Paper } from '@mui/material';
import { Hidden } from '@mui/material';

import { HeaderBar } from './headerBar';
import { SideBarDrawer, MobileDrawer } from './sidebar';
import { SectionNavigationList } from './sectionNavigationList';
import { SnackMessage } from './utils/snackMessage';
import ErrorBoundary from './utils/errorboundary';

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

  const handleDrawerToggle = useCallback(() => {
    setMobileDrawerOpen((prev) => !prev);
  }, [setMobileDrawerOpen]);

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

        <Hidden smDown implementation="css">
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
