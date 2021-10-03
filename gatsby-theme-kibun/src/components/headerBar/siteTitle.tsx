import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useStaticQuery, graphql } from 'gatsby';
import { MuiGatsbyLink } from '../../utils/link';

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
