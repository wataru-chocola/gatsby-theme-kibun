import React from 'react';

import { useStaticQuery, graphql } from 'gatsby';
import { MuiGatsbyLink } from '../../utils/link';

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

  return (
    <MuiGatsbyLink
      color="inherit"
      variant="h6"
      to="/"
      noWrap
      underline="none"
      sx={{
        backgroundColor: 'primary.main',
        borderRadius: 1,
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 2,
        paddingRight: 2,
        '&:hover, &:focus': {
          backgroundColor: 'primary.light',
        },
      }}
    >
      {siteTitle}
    </MuiGatsbyLink>
  );
};
