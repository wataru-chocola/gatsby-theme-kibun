import React from 'react';
import { MuiGatsbyLink } from '../../uiparts/link';

export const A: React.FC<any> = (props) => {
  const { href, ...remainedProps } = props;
  const link = href ? (
    <MuiGatsbyLink to={href} {...remainedProps}></MuiGatsbyLink>
  ) : (
    <MuiGatsbyLink {...remainedProps}></MuiGatsbyLink>
  );
  return link;
};
A.displayName = 'A';
