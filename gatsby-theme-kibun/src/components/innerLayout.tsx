import React, { useCallback } from 'react';
import { Toolbar } from '@mui/material';
import { Box } from '@mui/material';
import { Paper } from '@mui/material';

import { HeaderBar } from './headerBar';
import { SectionBar } from './sectionBar';
import { Attachments } from './attachments';
import { SnackMessage } from './utils/snackMessage';
import { EditButton } from './editButton';
import { Footer } from './footer';
import ErrorBoundary from './utils/errorboundary';

import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'overlayscrollbars/css/OverlayScrollbars.css';

export type InnerLayoutProps = {
  pageTitle: string;
};

const InnerLayout: React.FC<InnerLayoutProps> = ({ pageTitle, children }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const toggleDrawer = useCallback(
    (open?: boolean) => () => {
      if (open != null) {
        setDrawerOpen(open);
      } else {
        setDrawerOpen((prev) => !prev);
      }
    },
    [setDrawerOpen],
  );

  return (
    <Box
      sx={{
        // OverlayScrollbars
        '.os-theme-dark.os-theme-custom': {
          '> .os-scrollbar > .os-scrollbar-track > .os-scrollbar-handle': {
            opacity: 0.2,
          },
        },
      }}
    >
      <SnackMessage />
      <HeaderBar onMenuButton={toggleDrawer()} pageTitle={pageTitle} />

      <Box sx={{ display: 'flex' }}>
        <nav aria-label="sidemenu">
          <SectionBar drawerOpenState={drawerOpen} toggleDrawer={toggleDrawer} />
        </nav>

        <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1, width: '100%' }}>
          <Box
            component="main"
            sx={{
              minWidth: { xs: '320px' },
              maxWidth: { xs: '100%', sm: '900px', md: '900px' },
              width: '100%',
              position: 'relative',
            }}
          >
            <Toolbar />

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
              <Paper>
                {children}
                <Box mt={8}>
                  <Footer />
                </Box>
              </Paper>
            </ErrorBoundary>
          </Box>
          <Box width="350px" sx={{ display: { xs: 'none', lg: 'block' }, flexShrink: 0 }}>
            <Box
              height="100%"
              width="350px"
              position="fixed"
              left="auto"
              sx={{ display: 'flex', flexDirection: 'column' }}
            >
              <Toolbar />
              <OverlayScrollbarsComponent
                options={{
                  className: 'os-theme-dark os-theme-custom os-host-flexbox',
                  scrollbars: {
                    clickScrolling: true,
                  },
                }}
              >
                <Attachments />
              </OverlayScrollbarsComponent>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InnerLayout;
