import React from 'react';

import { Drawer, DrawerProps } from '@material-ui/core';
import { Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  drawerContainer: {
    overflow: 'auto',
  },
}));

export const MobileDrawer: React.FC<DrawerProps> = (props) => {
  const classes = useStyles();

  return (
    <Drawer variant="temporary" {...props}>
      <Toolbar />
      <div className={classes.drawerContainer}>{props.children}</div>
    </Drawer>
  );
};

export const SideBarDrawer: React.FC<DrawerProps> = (props) => {
  const classes = useStyles();

  return (
    <Drawer variant="permanent" {...props}>
      <Toolbar />
      <div className={classes.drawerContainer}>{props.children}</div>
    </Drawer>
  );
};
