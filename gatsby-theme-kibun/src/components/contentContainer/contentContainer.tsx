import React from 'react';
import { SxProps, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/material';
import { Paper } from '@mui/material';

import { EditButton } from './editButton';
import ErrorBoundary from '../utils/errorboundary';

export type ContentContainerProps = {
  footer: React.ReactElement;
  sx?: Omit<SxProps, 'position'>;
};

export const ContentContainer: React.FC<ContentContainerProps> = (props) => {
  const sx = props.sx || {};
  const theme = useTheme();
  const isSinglePane = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });
  return (
    <Box
      component="main"
      sx={{
        ...sx,
        position: 'relative',
      }}
    >
      <ErrorBoundary fallback={<h1>Error: Something wrong happened (&gt;&lt;)</h1>}>
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            '& > *': {
              pointerEvents: 'auto',
            },
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <EditButton />
        </Box>

        <Toolbar />
        <Paper elevation={isSinglePane ? 0 : 1}>
          {props.children}
          <Box mt={8}>{props.footer}</Box>
        </Paper>
      </ErrorBoundary>
    </Box>
  );
};
ContentContainer.displayName = 'ContentContainer';
