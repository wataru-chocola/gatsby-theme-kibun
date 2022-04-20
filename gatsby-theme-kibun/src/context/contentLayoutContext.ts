import React from 'react';

export type ContentLayoutContextType = {
  contentBoxWidth?: number;
  expandedContentWidth?: number;
};

export const ContentLayoutContext = React.createContext<ContentLayoutContextType>({});
