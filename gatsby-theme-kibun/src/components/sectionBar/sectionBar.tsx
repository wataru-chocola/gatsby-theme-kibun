import React from 'react';
import { ResponsiveDrawer } from '../uiparts/responsiveDrawer';
import { FilterBox } from './filterBox';
import { SectionNaviList } from './sectionNaviList';
import { Toolbar } from '@mui/material';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

interface Props {
  drawerOpenState: boolean;
  toggleDrawer: (open?: boolean) => () => void;
}

const MemorizedSectionNavigationList = React.memo(SectionNaviList);

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
          <FilterBox />
          <MemorizedSectionNavigationList />
        </OverlayScrollbarsComponent>
      </ResponsiveDrawer>
    </nav>
  );
};
SectionBar.displayName = 'SectionBar';
