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

const SideBar: React.FC<DrawerProps> = (props) => {
  const classes = useStyles();

  return (
    <Drawer variant="permanent" {...props}>
      <Toolbar />
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
    </Drawer>
  );
};

export default SideBar;