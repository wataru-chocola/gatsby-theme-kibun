import React from 'react';
import { ListItemButton, ListItemButtonProps } from '@mui/material';

import { GatsbyLink, GatsbyLinkProps } from '../../utils/link';

type ListItemGatsbyLinkProps = Omit<
  ListItemButtonProps<typeof GatsbyLink, GatsbyLinkProps>,
  'component'
>;
export type ListItemLinkProps = ListItemGatsbyLinkProps | ListItemButtonProps;

function isListItemButtonGatsbyLinkProps(
  props: ListItemLinkProps,
): props is ListItemGatsbyLinkProps {
  return (props as ListItemGatsbyLinkProps).to != null;
}

export const ListItemLink: React.VFC<ListItemLinkProps> = (props) => {
  if (isListItemButtonGatsbyLinkProps(props)) {
    return <ListItemButton component={GatsbyLink} {...props} />;
  } else {
    return <ListItemButton {...props} />;
  }
};
ListItemLink.displayName = 'ListItemLink';
