import React from "react";
import { AppBar as MUIAppBar, AppBarProps, Toolbar } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { useStaticQuery, graphql } from "gatsby";
import MenuIcon from "@material-ui/icons/Menu";


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