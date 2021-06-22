import React from "react";

import { Drawer, DrawerProps } from '@material-ui/core';
import { Toolbar } from '@material-ui/core';
import { List, ListItemText, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  drawerContainer: {
    overflow: 'auto',
  },
}));


export const DrawerContent = () => {
  const classes = useStyles();

  return (
    <div className={classes.drawerContainer}>
      <List>
        <ListItem button key={1}>
          <ListItemText primary="Link 1" />
        </ListItem>
        <ListItem button key={2}>
          <ListItemText primary="Link 2" />
        </ListItem>
      </List>
    </div>
  );
};

export const MobileDrawer: React.FC<DrawerProps> = (props) => {
  return (
    <Drawer variant="temporary" {...props}>
      <Toolbar />
      {props.children}
    </Drawer>
  );
};


export const SideBarDrawer: React.FC<DrawerProps> = (props) => {
  return (
    <Drawer variant="permanent" {...props}>
      <Toolbar />
      {props.children}
    </Drawer>
  );
};