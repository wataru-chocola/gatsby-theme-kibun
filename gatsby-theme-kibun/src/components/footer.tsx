import React from 'react';

import { useSiteTitle } from '../hooks/useSiteTitle';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';

export const Footer: React.VFC = () => {
  const siteTitle: string = useSiteTitle();

  return (
    <React.Fragment>
      <Box py={2} bgcolor="primary.light" minHeight="100px" color="primary.contrastText">
        <Box px={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography sx={{ fontWeight: 'bold' }}>{siteTitle}</Typography>
        </Box>
      </Box>
      <Box px={2} bgcolor="primary.main" color="primary.contrastText" textAlign="right">
        <Typography sx={{ fontSize: '14px' }}>Powered by kibun</Typography>
      </Box>
    </React.Fragment>
  );
};
Footer.displayName = 'Footer';
