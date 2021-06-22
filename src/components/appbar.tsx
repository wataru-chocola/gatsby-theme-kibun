import React from "react";
import { fade, makeStyles } from "@material-ui/core";
import { AppBar as MUIAppBar, AppBarProps, Toolbar } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { InputBase } from '@material-ui/core';
import { useStaticQuery, graphql } from "gatsby";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountIcon from "@material-ui/icons/Search";


export const SiteTitle = () => {
  const data = useStaticQuery<GatsbyTypes.SiteTitleQuery>(
    graphql`
    query SiteTitle {
      site {
        siteMetadata {
          title
        }
      }
    }
    `
  );

  const siteTitle: string = data.site?.siteMetadata?.title || `(no sitename)`

  return (
    <Typography variant="h6" noWrap>
      {siteTitle}
    </Typography>
  );
};

interface MenuButtonProps {
  onClick: () => void;
  className: string;
}

export const MenuButton = ({ onClick, className }: MenuButtonProps) => {
  return (
    <IconButton
      color="inherit"
      aria-label="open drawer"
      edge="start"
      onClick={onClick}
      className={className}
    >
      <MenuIcon />
    </IconButton>
  );
};

const useSearchStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export const SearchBox = () => {
  const classes = useSearchStyles();
  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase placeholder="Search..."
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search' }}
      />
    </div>
  );
};

export const AppBar: React.FC<AppBarProps> = (props) => {
  const { children, ...passThroughProps } = props;
  return (
    <MUIAppBar position="fixed" {...passThroughProps}>
      <Toolbar>
        {props.children}
      </Toolbar>
    </MUIAppBar>
  );
};