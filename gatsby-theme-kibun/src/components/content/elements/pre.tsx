import React from 'react';

import { Box, SxProps, useTheme } from '@mui/material';

import { ContentLayoutContext } from '../../../context/contentLayoutContext';

export const Pre: React.FC<JSX.IntrinsicElements['pre']> = ({ children, ...props }) => {
  const { contentBoxWidth, expandedContentWidth } = React.useContext(ContentLayoutContext);
  const theme = useTheme();

  const preStyle: SxProps = React.useMemo(() => {
    const isExpanded = expandedContentWidth && contentBoxWidth;
    return {
      '.content & pre': {
        paddingY: '1.5em',
      },
      '.content > & > pre': {
        marginX: {
          xs: -2,
          sm: `${-(
            parseInt(theme.spacing(6)) +
            (isExpanded ? (expandedContentWidth - contentBoxWidth) / 2 : 0)
          )}px`,
        },
        paddingX: {
          xs: 2,
          sm: `${
            parseInt(theme.spacing(7)) +
            (isExpanded ? (expandedContentWidth - contentBoxWidth) / 2 : 0)
          }px`,
        },
        borderRadius: 0,
        marginTop: 4,
        marginBottom: 5,
      },
    };
  }, [contentBoxWidth, expandedContentWidth, theme]);

  return (
    <Box sx={preStyle}>
      <pre {...props}>{children}</pre>
    </Box>
  );
};

export default Pre;
