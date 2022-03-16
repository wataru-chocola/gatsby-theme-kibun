import React from 'react';

import { IconButton, IconButtonProps } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

type ActionButtonProps = Pick<IconButtonProps, 'onClick' | 'edge'>;

export const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>((props, ref) => {
  return (
    <IconButton
      color="primary"
      aria-label="open drawer"
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
      <MoreVertIcon />
    </IconButton>
  );
});
ActionButton.displayName = 'ActionButton';
