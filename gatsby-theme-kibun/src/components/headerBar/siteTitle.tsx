import React from 'react';

import { useStaticQuery, graphql } from 'gatsby';
import { MuiGatsbyLink } from '../../utils/link';
import { Box } from '@mui/material';

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
    <Box>
      <MuiGatsbyLink
        variant="h6"
        to="/"
        noWrap
        underline="none"
        sx={{
          color: 'primary.main',
          fontSize: '16px',
          fontWeight: 'bold',
          '&:hover, &:focus': {
            color: 'primary.light',
          },
        }}
      >
        {siteTitle}
      </MuiGatsbyLink>
    </Box>
  );
};
