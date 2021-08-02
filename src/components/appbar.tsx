import React from 'react';
import { makeStyles, alpha } from '@material-ui/core/styles';
import { AppBar as MUIAppBar, AppBarProps, Toolbar } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { InputBase } from '@material-ui/core';
import { useStaticQuery, graphql } from 'gatsby';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

import { MuiGatsbyLink } from '../utils/link';

const useSiteTitleStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: '1em',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.light,
    },
  },
}));

export const SiteTitle: React.VFC = () => {
  const data = useStaticQuery<GatsbyTypes.SiteTitleQuery>(
    graphql`
      query SiteTitle {
        site {
          siteMetadata {
            title
          }
        }
      }
    `,
  );

  const siteTitle: string = data.site?.siteMetadata?.title || `(no sitename)`;
  const classes = useSiteTitleStyles();

  return (
    <MuiGatsbyLink
      color="inherit"
      variant="h6"
      to="/"
      noWrap
      underline="none"
      className={classes.root}
    >
      {siteTitle}
    </MuiGatsbyLink>
  );
};

interface MenuButtonProps {
  onClick: () => void;
  className: string;
}

export const MenuButton = React.forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ onClick, className }, ref) => {
    return (
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={onClick}
        className={className}
        ref={ref}
      >
        <MenuIcon />
      </IconButton>
    );
  },
);
MenuButton.displayName = 'MenuButton';

const useSearchStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
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

export const SearchBox = React.forwardRef<HTMLInputElement>((_props, ref) => {
  const classes = useSearchStyles();
  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search..."
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search' }}
        ref={ref}
      />
    </div>
  );
});
SearchBox.displayName = 'SearchBox';

export const AppBar: React.FC<AppBarProps> = (props) => {
  const { children, ...passThroughProps } = props;
  return (
    <MUIAppBar position="fixed" {...passThroughProps}>
      <Toolbar>{props.children}</Toolbar>
    </MUIAppBar>
  );
};
