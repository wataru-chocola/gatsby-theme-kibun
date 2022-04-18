import React from 'react';

import { useSiteTitle } from '../hooks/useSiteTitle';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import { ContentLayoutContext } from '../context/contentLayoutContext';

export const Footer: React.VFC = () => {
  const siteTitle: string = useSiteTitle();
  const { contentBoxWidth, expandedContentWidth } = React.useContext(ContentLayoutContext);
  const isExpanded = expandedContentWidth && contentBoxWidth;

  return (
    <Box
      marginX={isExpanded ? `${-(expandedContentWidth - contentBoxWidth) / 2}px` : 0}
      width={isExpanded ? expandedContentWidth : 'auto'}
    >
      <Box
        py={2}
        bgcolor="primary.light"
        minHeight="100px"
        color="primary.contrastText"
        paddingX={isExpanded ? `${(expandedContentWidth - contentBoxWidth) / 2}px` : 0}
      >
        <Box px={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography sx={{ fontWeight: 'bold' }}>{siteTitle}</Typography>
        </Box>
      </Box>
      <Box
        px={2}
        bgcolor="primary.main"
        color="primary.contrastText"
        textAlign="right"
        paddingX={(theme) =>
          isExpanded
            ? `${parseInt(theme.spacing(2)) + (expandedContentWidth - contentBoxWidth) / 2}px`
            : 2
        }
      >
        <Typography sx={{ fontSize: '14px' }}>Powered by kibun</Typography>
      </Box>
    </Box>
  );
};
Footer.displayName = 'Footer';
