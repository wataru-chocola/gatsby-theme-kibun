import React from 'react';
import { IconButton } from '@material-ui/core';
import { Menu, MenuItem } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';

interface AccountButtonProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const AccountButton = React.forwardRef<HTMLButtonElement, AccountButtonProps>(
  ({ setIsLoggedIn }, ref) => {
    const menuId = 'account-menu';
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    const handleLogout = () => {
      setIsLoggedIn(false);
      setAnchorEl(null);
    };

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    );

    return (
      <React.Fragment>
        <IconButton
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
          ref={ref}
        >
          <AccountCircle />
        </IconButton>
        {renderMenu}
      </React.Fragment>
    );
  },
);
AccountButton.displayName = 'AccountButton';
