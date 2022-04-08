import React from 'react';
import { Menu, MenuProps, MenuItem } from '@mui/material';
import Divider from '@mui/material/Divider';

import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { selectIsLoggedIn } from '../../state/loginSelector';
import { loginActions } from '../../state/loginSlice';

type ActionHandlersProps = {
  handleEdit?: () => void;
  handleMove?: () => void;
  handleOpenAttachment?: () => void;
  handleLogout?: () => void;
};
type ActionMenuProps = MenuProps & ActionHandlersProps;

export const ActionMenu = React.forwardRef<HTMLDivElement, ActionMenuProps>(
  ({ handleEdit, handleMove, handleOpenAttachment, handleLogout, ...props }, ref) => {
    const isLoggedIn = useAppSelector((state) => selectIsLoggedIn(state));
    const dispatch = useAppDispatch();

    const handleNothing = () => {
      return;
    };
    handleEdit = handleEdit || handleNothing;
    handleMove = handleMove || handleNothing;
    handleOpenAttachment = handleOpenAttachment || handleNothing;

    handleLogout =
      handleLogout ||
      (() => {
        dispatch(loginActions.logOut({}));
      });

    const withClose: (
      f: React.MouseEventHandler<HTMLLIElement>,
    ) => React.MouseEventHandler<HTMLLIElement> = (f) => {
      return (...args: Parameters<React.MouseEventHandler<HTMLLIElement>>) => {
        try {
          return f(...args);
        } finally {
          if (props.onClose != null) {
            props.onClose({}, 'backdropClick');
          }
        }
      };
    };

    return (
      <Menu ref={ref} {...props}>
        <MenuItem disabled={!isLoggedIn} onClick={withClose(handleEdit)}>
          Edit
        </MenuItem>
        <MenuItem disabled={!isLoggedIn} onClick={withClose(handleMove)}>
          Move
        </MenuItem>
        <MenuItem onClick={withClose(handleOpenAttachment)}>Attachment</MenuItem>
        <Divider />
        <MenuItem disabled={!isLoggedIn} onClick={withClose(handleLogout)}>
          Logout
        </MenuItem>
      </Menu>
    );
  },
);
ActionMenu.displayName = 'ActionMenu';
