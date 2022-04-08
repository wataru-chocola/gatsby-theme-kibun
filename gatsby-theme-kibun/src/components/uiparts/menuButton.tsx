import React from 'react';

import { MenuProps } from '@mui/material';
import { IconButton, IconButtonProps } from '../uiparts/iconButton';

type MenuButtonProps<P extends MenuProps = MenuProps> = Omit<
  IconButtonProps,
  'onClick' | 'children'
> & {
  menuId: string;
  icon: React.ReactElement;
  menu: React.VFC<P>;
  menuExtraProps?: P;
};

type MenuButtonType = (<P extends MenuProps = MenuProps>(
  props: MenuButtonProps<P>,
  ref: React.Ref<HTMLButtonElement>,
) => React.ReactElement | null) & { displayName?: string };

const MenuButtonInner: MenuButtonType = ({ menuId, icon, menu, menuExtraProps, ...props }, ref) => {
  const MenuComponent = menu;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuProps = Object.assign({}, menuExtraProps);

  return (
    <React.Fragment>
      <IconButton aria-controls={menuId} onClick={handleMenuOpen} ref={ref} {...props}>
        {icon}
      </IconButton>
      <MenuComponent
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        id={menuId}
        keepMounted={true}
        onClose={handleMenuClose}
        {...menuProps}
        open={isMenuOpen}
      />
    </React.Fragment>
  );
};

export const MenuButton: MenuButtonType = React.forwardRef(MenuButtonInner) as <
  P extends MenuProps = MenuProps,
>(
  props: MenuButtonProps<P> & { ref?: React.ForwardedRef<HTMLButtonElement> },
) => ReturnType<typeof MenuButtonInner>;
MenuButton.displayName = 'MenuButton';
