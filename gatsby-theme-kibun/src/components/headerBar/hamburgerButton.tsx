import React from 'react';

import { IconButton, IconButtonProps } from '../uiparts/iconButton';
import MenuIcon from '@mui/icons-material/Menu';

type HamburgerButtonProps = Pick<IconButtonProps, 'onClick' | 'edge'>;

export const HamburgerButton = React.forwardRef<HTMLButtonElement, HamburgerButtonProps>(
  (props, ref) => {
    return (
      <IconButton aria-label="open drawer" ref={ref} {...props}>
        <MenuIcon />
      </IconButton>
    );
  },
);
HamburgerButton.displayName = 'HamburgerButton';
