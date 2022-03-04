import React from 'react';
import { IconButton } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

import { useAppDispatch } from '../../state/hooks';
import { loginActions } from '../../state/loginSlice';

export const AccountButton = React.forwardRef<HTMLButtonElement>((_props, ref) => {
  const menuId = 'account-menu';
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const dispatch = useAppDispatch();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(loginActions.logOut({}));
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
        color="primary"
        sx={{
          padding: 1,
          '&:hover': {
            backgroundColor: (theme) => theme.palette.primary.main,
            color: 'white',
          },
        }}
        ref={ref}
        size="large"
      >
        <AccountCircle />
      </IconButton>
      {renderMenu}
    </React.Fragment>
  );
});
AccountButton.displayName = 'AccountButton';
