import React from 'react';

import { IconButton, IconButtonProps } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

type MenuButtonProps = Pick<IconButtonProps, 'onClick'>;

export const MenuButton = React.forwardRef<HTMLButtonElement, MenuButtonProps>((props, ref) => {
  return (
    <IconButton
      color="primary"
      aria-label="open drawer"
      edge="start"
      size="large"
      ref={ref}
      sx={{
        '&:hover': {
          backgroundColor: (theme) => theme.palette.primary.main,
          color: 'white',
        },
      }}
      {...props}
    >
      <MenuIcon />
    </IconButton>
  );
});
MenuButton.displayName = 'MenuButton';
