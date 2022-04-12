import React, { useCallback } from 'react';
import { Box, MenuProps } from '@mui/material';

import { HeaderBar } from './headerBar';
import { ActionMenu } from './headerBar/actionMenu';
import { SectionBar } from './sectionBar';
import { RightPanel } from './rightPanel';
import { SnackMessage } from './utils/snackMessage';
import { ContentContainer } from './contentContainer';
import { Footer } from './footer';

import 'overlayscrollbars/css/OverlayScrollbars.css';

export type InnerLayoutProps = {
  pageTitle: string;
};

const rightPanelWidth = '320px';

const InnerLayout: React.FC<InnerLayoutProps> = ({ pageTitle, children }) => {
  const [leftMenuOpen, setLeftMenuOpen] = React.useState(false);
  const toggleLeftMenu = useCallback(
    (open?: boolean) => () => {
      if (open != null) {
        setLeftMenuOpen(open);
      } else {
        setLeftMenuOpen((prev) => !prev);
      }
    },
    [setLeftMenuOpen],
  );

  const [rightPanelOpen, setRightPanelOpen] = React.useState(false);
  const toggleRightPanel = useCallback(
    (open?: boolean) => () => {
      if (open != null) {
        setRightPanelOpen(open);
      } else {
        setRightPanelOpen((prev) => !prev);
      }
    },
    [setRightPanelOpen],
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
      <HeaderBar
        onHamburgerButton={toggleLeftMenu()}
        pageTitle={pageTitle}
        menuRender={menuRender}
      />

      <Box sx={{ display: 'flex' }}>
        <nav aria-label="sidemenu">
          <SectionBar openState={leftMenuOpen} toggle={toggleLeftMenu} />
        </nav>

        <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1, width: '100%' }}>
          <ContentContainer footer={<Footer />}>{children}</ContentContainer>
          <RightPanel
            width={rightPanelWidth}
            openState={rightPanelOpen}
            toggle={toggleRightPanel}
          />
        </Box>
      </Box>
    </Box>
  );
};
InnerLayout.displayName = 'InnerLayout';
export default InnerLayout;
