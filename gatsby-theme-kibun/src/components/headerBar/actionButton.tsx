import React from 'react';

import { IconButton, IconButtonProps } from '../uiparts/iconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { ActionMenu } from './actionMenu';

type ActionButtonProps = Pick<IconButtonProps, 'onClick' | 'edge'>;

export const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>((props, ref) => {
  const menuId = 'action-menu';
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
      <IconButton
        aria-label="open action menu"
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={handleMenuOpen}
        ref={ref}
        {...props}
      >
        <MoreVertIcon />
      </IconButton>
      <ActionMenu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        id={menuId}
        keepMounted
        open={isMenuOpen}
        onClose={handleMenuClose}
        close={handleMenuClose}
      />
    </React.Fragment>
  );
});
ActionButton.displayName = 'ActionButton';
