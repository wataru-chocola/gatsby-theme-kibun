import React, { useCallback } from 'react';
import { Box } from '@mui/material';

import { SidebarLayout } from './sidebarLayout';
import { HeaderBarLayout } from './headerBarLayout';
import { RightPanelLayout } from './rightPanelLayout';

import { SnackMessage } from '../utils/snackMessage';
import { ContentContainer } from '../contentContainer';
import { Footer } from '../footer';

import 'overlayscrollbars/css/OverlayScrollbars.css';

type LayoutControl = {
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  toggleSidebar: (open?: boolean) => void;
  toggleRightPanel: (open?: boolean) => void;
};
export function useLayoutControl(): LayoutControl {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [rightPanelOpen, setRightPanelOpen] = React.useState(false);

  const toggleSidebar = useCallback(
    (open?: boolean) => {
      setRightPanelOpen(false);
      if (open != null) {
        setSidebarOpen(open);
      } else {
        setSidebarOpen((prev) => !prev);
      }
    },
    [setSidebarOpen, setRightPanelOpen],
  );

  const toggleRightPanel = useCallback(
    (open?: boolean) => {
      setSidebarOpen(false);
      if (open != null) {
        setRightPanelOpen(open);
      } else {
        setRightPanelOpen((prev) => !prev);
      }
    },
    [setSidebarOpen, setRightPanelOpen],
  );

  return {
    sidebarOpen,
    rightPanelOpen,
    toggleSidebar,
    toggleRightPanel,
  };
}

export type InnerLayoutProps = {
  headerContent: React.ReactElement;
  sidebarContent: React.ReactElement;
  rightPanelContent: React.ReactElement;
  control: LayoutControl;
};

const sidebarWidth = '300px';
const rightPanelWidth = '320px';

const InnerLayout: React.FC<InnerLayoutProps> = ({
  headerContent,
  sidebarContent,
  rightPanelContent,
  control,
  children,
}) => {
  const onHamburgerButton = React.useCallback(() => control.toggleSidebar(), [control]);

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
      <HeaderBarLayout onHamburgerButton={onHamburgerButton}>{headerContent}</HeaderBarLayout>

      <Box sx={{ display: 'flex' }}>
        <nav aria-label="sidemenu">
          <SidebarLayout
            width={sidebarWidth}
            openState={control.sidebarOpen}
            toggle={control.toggleSidebar}
          >
            {sidebarContent}
          </SidebarLayout>
        </nav>

        <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1, width: '100%' }}>
          <ContentContainer
            footer={<Footer />}
            sx={{
              minWidth: { xs: '320px' },
              maxWidth: { xs: '100%', sm: '900px', md: '900px' },
              width: '100%',
            }}
          >
            {children}
          </ContentContainer>
          <RightPanelLayout
            width={rightPanelWidth}
            openState={control.rightPanelOpen}
            toggle={control.toggleRightPanel}
          >
            {rightPanelContent}
          </RightPanelLayout>
        </Box>
      </Box>
    </Box>
  );
};
InnerLayout.displayName = 'InnerLayout';
export default InnerLayout;
