import React from 'react';

import { MenuProps } from '@mui/material';
import { IconButton, IconButtonProps } from '../uiparts/iconButton';

type MenuButtonProps = Omit<IconButtonProps, 'onClick' | 'children'> & {
  menuId: string;
  icon: React.ReactElement;
  menuRender: (props: MenuProps) => React.ReactNode;
};

export const MenuButton = React.forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ menuId, icon, menuRender, ...props }, ref) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    return (
      <React.Fragment>
        <IconButton aria-controls={menuId} onClick={handleMenuOpen} ref={ref} {...props}>
          {icon}
        </IconButton>
        {menuRender({
          anchorEl: anchorEl,
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          id: menuId,
          keepMounted: true,
          onClose: handleMenuClose,
          open: isMenuOpen,
        })}
      </React.Fragment>
    );
  },
);
MenuButton.displayName = 'MenuButton';
