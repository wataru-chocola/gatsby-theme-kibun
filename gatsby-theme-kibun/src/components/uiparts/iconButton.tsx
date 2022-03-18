import React from 'react';

import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps } from '@mui/material';

export type IconButtonProps = MuiIconButtonProps & {
  children: React.ReactElement;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <MuiIconButton
        color="primary"
        size="medium"
        ref={ref}
        sx={{
          '&:hover': {
            backgroundColor: (theme) => theme.palette.primary.main,
            color: 'white',
          },
        }}
        {...props}
      >
        {children}
      </MuiIconButton>
    );
  },
);
IconButton.displayName = 'IconButton';
