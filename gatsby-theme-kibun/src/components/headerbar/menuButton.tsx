import React from 'react';

import { IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

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
      >
        <MenuIcon />
      </IconButton>
    );
  },
);
MenuButton.displayName = 'MenuButton';
