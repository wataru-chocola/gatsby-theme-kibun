import React from "react";
import { CssBaseline, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Container } from "@material-ui/core";
import { Hidden } from "@material-ui/core";

import Seo from "../components/seo";

import { AppBar, SiteTitle, MenuButton, SearchBox } from "../components/appbar";
import { SideBarDrawer, MobileDrawer, DrawerContent } from "../components/sidebar";
import PathBreadcrumbs from "../components/breadcrumbs";


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
      display: "none",
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
    padding: theme.spacing(3),
  }
}));


interface LayoutProps {
  pageTitle: string;
  window?: () => Window;
}


const Layout: React.FC<LayoutProps> = ({ window, pageTitle, children }) => {
  const classes = useStyles();
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);
  const container = window !== undefined ? () => window().document.body : undefined;

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Seo title={pageTitle} />
      <AppBar className={classes.appBar} >
        <MenuButton className={classes.menuButton} onClick={handleDrawerToggle}/>
        <SiteTitle />
        <div className={classes.grow} />
        <SearchBox />
      </AppBar>

      <nav aria-label="sidemenu">
        <Hidden smUp implementation="css">
          <MobileDrawer container={container}
           open={mobileDrawerOpen} onClose={handleDrawerToggle}
          >
            <DrawerContent />
          </MobileDrawer>
        </Hidden>

        <Hidden xsDown implementation="css">
          <SideBarDrawer className={classes.drawer} classes={{
            paper: classes.drawerPaper,
          }}>
            <DrawerContent />
          </SideBarDrawer>
        </Hidden>
      </nav>

      <main className={classes.content}>
        <Toolbar />
        <Container maxWidth="md">
          <PathBreadcrumbs crumbs={[{path: 'dummy', title: 'Dummy'}, {path: 'cc', title: 'dd'}]} />
          <Typography paragraph>
          {children}
          </Typography>
        </Container>
      </main>
    </div>
  )
}

export default Layout;