import React from 'react';

import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface MenuButtonProps {
  onClick: () => void;
  className: string;
}

export const MenuButton = React.forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ onClick, className }, ref) => {
    return (
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={onClick}
        className={className}
        ref={ref}
        size="large">
        <MenuIcon />
      </IconButton>
    );
  },
);
MenuButton.displayName = 'MenuButton';
