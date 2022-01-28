import React, { useCallback } from 'react';
import { Toolbar } from '@mui/material';
import { Box, Container, ContainerProps } from '@mui/material';
import { Paper } from '@mui/material';

import { HeaderBar } from './headerBar';
import { SideBarDrawer, MobileDrawer } from './sidebar';
import { FilterBox } from './filterBox';
import { SectionNavigationList } from './sectionNavigationList';
import { SnackMessage } from './utils/snackMessage';
import ErrorBoundary from './utils/errorboundary';

import 'overlayscrollbars/css/OverlayScrollbars.css';

const drawerWidth = 300;

export type InnerLayoutProps = {
  window?: () => Window;
} & Pick<ContainerProps, 'children'>;

const InnerLayout: React.FC<InnerLayoutProps> = ({ window, children }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);
  const container = window !== undefined ? () => window().document.body : undefined;

  const handleDrawerToggle = useCallback(() => {
    setMobileDrawerOpen((prev) => !prev);
  }, [setMobileDrawerOpen]);

  const drawerSx = {
    width: {
      sm: drawerWidth,
    },
    flexShrink: {
      sm: 0,
    },
    '& .MuiDrawer-paper': {
      width: drawerWidth,
    },
  } as const;

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
      <HeaderBar onMenuButton={handleDrawerToggle} />

      <Box sx={{ display: 'flex' }}>
        <nav aria-label="sidemenu">
          <MobileDrawer
            container={container}
            open={mobileDrawerOpen}
            onClose={handleDrawerToggle}
            sx={{
              display: { xs: 'block', sm: 'none' },
              ...drawerSx,
            }}
          >
            <SectionNavigationList />
          </MobileDrawer>

          <SideBarDrawer
            sx={{
              display: { xs: 'none', md: 'block' },
              ...drawerSx,
            }}
          >
            <FilterBox />
            <SectionNavigationList />
          </SideBarDrawer>
        </nav>

        <Box component="main" sx={{ flexGrow: 1 }}>
          <Toolbar />
          <Container maxWidth="md" fixed disableGutters>
            <ErrorBoundary fallback={<h1>Error: Something wrong happened (&gt;&lt;)</h1>}>
              <Paper>{children}</Paper>
            </ErrorBoundary>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default InnerLayout;
