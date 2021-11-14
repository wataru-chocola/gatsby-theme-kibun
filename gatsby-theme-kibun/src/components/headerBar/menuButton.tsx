import React from 'react';

import { IconButton, IconButtonProps } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

type MenuButtonProps = IconButtonProps;

export const MenuButton = React.forwardRef<HTMLButtonElement, MenuButtonProps>((props, ref) => {
  const newProps = Object.assign({}, props, {
    color: 'inherit',
    'aria-label': 'open drawer',
    edge: 'start',
    size: 'large',
    ref: ref,
  });
  return (
    <IconButton {...newProps}>
      <MenuIcon />
    </IconButton>
  );
});
MenuButton.displayName = 'MenuButton';
