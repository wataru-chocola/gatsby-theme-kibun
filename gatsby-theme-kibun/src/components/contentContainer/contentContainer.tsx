import React from 'react';
import { SxProps, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/material';
import { Paper } from '@mui/material';

import { EditButton } from './editButton';

import { ContentLayoutContext, ContentLayoutContextType } from '../../context/contentLayoutContext';
import { useElementWidth } from '../../hooks/useElementWidth';
import { useViewportWidth } from '../../hooks/useViewportWidth';
import ErrorBoundary from '../utils/errorboundary';

export type ContentContainerProps = {
  footer: React.ReactElement;
  sx?: Omit<SxProps, 'position'>;
};

export const ContentContainer: React.FC<ContentContainerProps> = (props) => {
  const contentBoxRef = React.useRef<HTMLDivElement>(null);
  const sx = props.sx || {};
  const theme = useTheme();
  const isSinglePane = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  const vpWidth = useViewportWidth();
  const contentBoxWidth = useElementWidth(contentBoxRef);
  const value: ContentLayoutContextType = {
    contentBoxWidth: contentBoxWidth,
    expandedContentWidth: isSinglePane && vpWidth > contentBoxWidth ? vpWidth : undefined,
  };

  return (
    <Box
      component="main"
      ref={contentBoxRef}
      sx={{
        ...sx,
        position: 'relative',
      }}
    >
      <Toolbar />
      <Box
        sx={{
          ...sx,
          position: 'relative',
        }}
      >
        <ErrorBoundary fallback={<h1>Error: Something wrong happened (&gt;&lt;)</h1>}>
          <ContentLayoutContext.Provider value={value}>
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

            <Paper elevation={isSinglePane ? 0 : 1}>
              {props.children}
              <Box mt={8}>{props.footer}</Box>
            </Paper>
          </ContentLayoutContext.Provider>
        </ErrorBoundary>
      </Box>
    </Box>
  );
};
ContentContainer.displayName = 'ContentContainer';
