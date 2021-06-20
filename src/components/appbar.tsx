import React from "react";
import { AppBar as MUIAppBar, AppBarProps, Toolbar } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { useStaticQuery, graphql } from "gatsby";


const AppBar: React.FC<AppBarProps> = (props) => {
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
    <MUIAppBar position="fixed" {...props}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          {siteTitle}
        </Typography>
      </Toolbar>
    </MUIAppBar>
  );
};

export default AppBar;