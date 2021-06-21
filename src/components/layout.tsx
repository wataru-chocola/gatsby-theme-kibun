import React from "react";
import { CssBaseline, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Container } from "@material-ui/core";

import Seo from "../components/seo";

import AppBar from "../components/appbar";
import SideBarDrawer from "../components/sidebar";
import PathBreadcrumbs from "../components/breadcrumbs";


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  }
}));


const Layout: React.FC<{ pageTitle: string }> = ({ pageTitle, children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Seo title={pageTitle} />
      <AppBar className={classes.appBar} />
      <nav aria-label="sidemenu">
        <SideBarDrawer className={classes.drawer} classes={{
          paper: classes.drawerPaper,
        }}/>
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