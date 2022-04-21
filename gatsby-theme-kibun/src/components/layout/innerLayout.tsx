import React, { useCallback } from 'react';
import { Box, MenuProps } from '@mui/material';

import { SidebarLayout } from './sidebarLayout';
import { HeaderBarLayout } from './headerBarLayout';
import { RightPanelLayout } from './rightPanel';

import { HeaderBar } from '../headerBar';
import { ActionMenu } from '../headerBar/actionMenu';
import { SnackMessage } from '../utils/snackMessage';
import { ContentContainer } from '../contentContainer';
import { Footer } from '../footer';

import 'overlayscrollbars/css/OverlayScrollbars.css';

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
  const [leftMenuOpen, setLeftMenuOpen] = React.useState(false);
  const [rightPanelOpen, setRightPanelOpen] = React.useState(false);

  const toggleLeftMenu = useCallback(
    (open?: boolean) => () => {
      setRightPanelOpen(false);
      if (open != null) {
        setLeftMenuOpen(open);
      } else {
        setLeftMenuOpen((prev) => !prev);
      }
    },
    [setLeftMenuOpen, setRightPanelOpen],
  );

  const toggleRightPanel = useCallback(
    (open?: boolean) => () => {
      setLeftMenuOpen(false);
      if (open != null) {
        setRightPanelOpen(open);
      } else {
        setRightPanelOpen((prev) => !prev);
      }
    },
    [setLeftMenuOpen, setRightPanelOpen],
  );
  const menuRender = useCallback(
    (props: MenuProps) => {
      return <ActionMenu handleOpenAttachment={toggleRightPanel(true)} {...props} />;
    },
    [toggleRightPanel],
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
      <HeaderBarLayout onHamburgerButton={toggleLeftMenu()}>
        <HeaderBar pageTitle={pageTitle} menuRender={menuRender} />
      </HeaderBarLayout>

      <Box sx={{ display: 'flex' }}>
        <nav aria-label="sidemenu">
          <SidebarLayout width={sidebarWidth} openState={leftMenuOpen} toggle={toggleLeftMenu}>
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
            openState={rightPanelOpen}
            toggle={toggleRightPanel}
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
