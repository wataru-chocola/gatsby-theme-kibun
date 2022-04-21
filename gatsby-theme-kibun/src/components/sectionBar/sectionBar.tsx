import React from 'react';
import { FilterBox } from './filterBox';
import { SectionNaviList } from './sectionNaviList';

const MemorizedSectionNavigationList = React.memo(SectionNaviList);

export const SectionBar: React.VFC = () => {
  return (
    <React.Fragment>
      <FilterBox />
      <MemorizedSectionNavigationList />
    </React.Fragment>
  );
};
SectionBar.displayName = 'SectionBar';
