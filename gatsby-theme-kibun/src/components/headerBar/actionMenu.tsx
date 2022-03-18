import React from 'react';
import { Menu, MenuProps, MenuItem } from '@mui/material';
import Divider from '@mui/material/Divider';

import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { selectIsLoggedIn } from '../../state/loginSelector';
import { loginActions } from '../../state/loginSlice';

type ActionMenuProps = MenuProps & {
  close: () => void;
};

export const ActionMenu = React.forwardRef<HTMLDivElement, ActionMenuProps>(
  ({ close, ...props }, ref) => {
    const isLoggedIn = useAppSelector((state) => selectIsLoggedIn(state));
    const dispatch = useAppDispatch();

    const handleEdit = () => {
      return;
    };

    const handleMove = () => {
      return;
    };

    const handleOpenAttachment = () => {
      return;
    };

    const handleLogout = () => {
      dispatch(loginActions.logOut({}));
      close();
    };

    return (
      <Menu ref={ref} {...props}>
        <MenuItem disabled={!isLoggedIn} onClick={handleEdit}>
          Edit
        </MenuItem>
        <MenuItem disabled={!isLoggedIn} onClick={handleMove}>
          Move
        </MenuItem>
        <MenuItem onClick={handleOpenAttachment}>Attachment</MenuItem>
        <Divider />
        <MenuItem disabled={!isLoggedIn} onClick={handleLogout}>
          Logout
        </MenuItem>
      </Menu>
    );
  },
);
ActionMenu.displayName = 'ActionMenu';
