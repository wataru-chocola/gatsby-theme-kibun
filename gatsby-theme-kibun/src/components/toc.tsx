import React from 'react';
import { Box } from '@mui/material';

type TableOfContentsProps = {
  containerWidth: number;
  expandedWidth?: number;
};

const TableOfContents: React.FC<TableOfContentsProps> = ({
  containerWidth,
  expandedWidth,
  children,
}) => {
  return (
    <Box
      borderTop={1}
      borderBottom={1}
      paddingTop={3}
      paddingBottom={1}
      bgcolor="#F6F6F6"
      marginX={expandedWidth ? `${-(expandedWidth - containerWidth) / 2}px` : 0}
      paddingX={expandedWidth ? `${(expandedWidth - containerWidth) / 2}px` : 0}
      width={expandedWidth || 'auto'}
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
        sx={{
          fontSize: '12px',
          backgroundColor: 'primary.main',
          color: 'white',
          position: 'absolute',
          top: '0%',
          left: '0%',
        }}
      >
        Table Of Contents
      </Box>
      {children}
    </Box>
  );
};

export default TableOfContents;
