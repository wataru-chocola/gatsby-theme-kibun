import React, { useCallback } from 'react';
import { Box, MenuProps } from '@mui/material';

import { SidebarLayout } from './sidebarLayout';
import { HeaderBarLayout } from './headerBarLayout';
import { RightPanelLayout } from './rightPanelLayout';

import { HeaderBar } from '../headerBar';
import { ActionMenu } from '../headerBar/actionMenu';
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
function useLayoutControl(): LayoutControl {
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
  pageTitle: string;
  sidebarContent: React.ReactElement;
  rightPanelContent: React.ReactElement;
};

const sidebarWidth = '300px';
const rightPanelWidth = '320px';

const InnerLayout: React.FC<InnerLayoutProps> = ({
  pageTitle,
  sidebarContent,
  rightPanelContent,
  children,
}) => {
  const control = useLayoutControl();
  const onHamburgerButton = React.useCallback(() => control.toggleSidebar(), [control]);
  const menuRender = useCallback(
    (props: MenuProps) => {
      return <ActionMenu handleOpenAttachment={() => control.toggleRightPanel(true)} {...props} />;
    },
    [control],
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
      <HeaderBarLayout onHamburgerButton={onHamburgerButton}>
        <HeaderBar pageTitle={pageTitle} menuRender={menuRender} />
      </HeaderBarLayout>

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
