import React from 'react';
import { IconButton } from '../uiparts/iconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';

import { ActionMenu } from './actionMenu';

export const AccountButton = React.forwardRef<HTMLButtonElement>((_props, ref) => {
  const menuId = 'account-menu';
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = (
    <ActionMenu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      close={handleMenuClose}
    />
  );

  return (
    <React.Fragment>
      <IconButton
        edge="end"
        aria-label="account of current user"
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
        ref={ref}
      >
        <AccountCircle />
      </IconButton>
      {renderMenu}
    </React.Fragment>
  );
});
AccountButton.displayName = 'AccountButton';
