import React from 'react';

import { useSiteTitle } from '../../hooks/useSiteTitle';
import { MuiGatsbyLink } from '../uiparts/link';
import { Box } from '@mui/material';

export const SiteTitle: React.VFC = () => {
  const siteTitle: string = useSiteTitle();

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
        <Box
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {siteTitle}
        </Box>
      </MuiGatsbyLink>
    </Box>
  );
};
