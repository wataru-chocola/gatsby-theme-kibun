import React from 'react';

import { IconButton, IconButtonProps } from '../uiparts/iconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

type ActionButtonProps = Pick<IconButtonProps, 'onClick' | 'edge'>;

export const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>((props, ref) => {
  return (
    <IconButton aria-label="open action menu" ref={ref} {...props}>
      <MoreVertIcon />
    </IconButton>
  );
});
ActionButton.displayName = 'ActionButton';
