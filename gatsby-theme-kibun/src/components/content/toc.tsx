import React from 'react';
import { Box } from '@mui/material';

import { ContentLayoutContext } from '../../context/contentLayoutContext';

const TableOfContents: React.FC = ({ children }) => {
  const { contentBoxWidth, expandedContentWidth } = React.useContext(ContentLayoutContext);
  const isExpanded = expandedContentWidth && contentBoxWidth;

  return (
    <Box
      component="nav"
      aria-label="table of contents"
      borderTop={1}
      borderBottom={1}
      paddingTop={3}
      paddingBottom={1}
      bgcolor="#F6F6F6"
      marginX={isExpanded ? `${-(expandedContentWidth - contentBoxWidth) / 2}px` : 0}
      paddingX={isExpanded ? `${(expandedContentWidth - contentBoxWidth) / 2}px` : 0}
      width={isExpanded ? expandedContentWidth : 'auto'}
      sx={{
        position: 'relative',
        fontSize: '14px',
        borderBottomColor: (theme) => theme.palette.primary.main,
        borderTopColor: (theme) => theme.palette.primary.main,

        'ul ul': {
          paddingLeft: 3,
        },
        li: {
          paddingLeft: 1,
        },
        '& > * > ul': {
          marginX: { xs: 0, sm: 3 },
          '> li': {
            position: 'relative',
            listStyle: 'none',
            '::before': {
              content: '""',
              position: 'absolute',
              top: '0.5em',
              left: '-11px',
              width: 0,
              height: 0,
              borderWidth: '5px',
              borderStyle: 'solid',
              borderColor: 'transparent transparent transparent #383838',
            },
          },
        },
      }}
    >
      <Box
        paddingX={2}
        fontSize="12px"
        bgcolor="primary.main"
        color="white"
        position="absolute"
        top="0%"
        left="0%"
      >
        Table Of Contents
      </Box>
      {children}
    </Box>
  );
};
TableOfContents.displayName = 'TableOfContents';

export default TableOfContents;
