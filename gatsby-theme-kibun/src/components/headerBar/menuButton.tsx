import React from 'react';

import { IconButton, IconButtonProps } from '../uiparts/iconButton';
import MenuIcon from '@mui/icons-material/Menu';

type MenuButtonProps = Pick<IconButtonProps, 'onClick' | 'edge'>;

export const MenuButton = React.forwardRef<HTMLButtonElement, MenuButtonProps>((props, ref) => {
  return (
    <IconButton aria-label="open drawer" ref={ref} {...props}>
      <MenuIcon />
    </IconButton>
  );
});
MenuButton.displayName = 'MenuButton';
