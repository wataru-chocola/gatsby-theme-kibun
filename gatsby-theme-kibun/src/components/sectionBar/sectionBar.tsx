import React from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { ResponsiveDrawer } from '../uiparts/responsiveDrawer';
import { FilterBox } from './filterBox';
import { SectionNavigationList } from './sectionNavigationList';
import { Toolbar } from '@mui/material';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

interface Props {
  drawerOpenState: boolean;
  toggleDrawer: (open?: boolean) => () => void;
}

const MemorizedSectionNavigationList = React.memo(SectionNavigationList);

export const SectionBar: React.VFC<Props> = (props) => {
  const drawerWidth = 300;
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

  const theme = useTheme();
  const sidebarDensed = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });

  return (
    <nav aria-label="sidemenu">
      <ResponsiveDrawer
        drawerOpenState={props.drawerOpenState}
        toggleDrawer={props.toggleDrawer}
        breakpoint="md"
        sx={drawerSx}
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
          {sidebarDensed ? (
            <MemorizedSectionNavigationList />
          ) : (
            <React.Fragment>
              <FilterBox />
              <MemorizedSectionNavigationList />
            </React.Fragment>
          )}
        </OverlayScrollbarsComponent>
      </ResponsiveDrawer>
    </nav>
  );
};
SectionBar.displayName = 'SectionBar';
