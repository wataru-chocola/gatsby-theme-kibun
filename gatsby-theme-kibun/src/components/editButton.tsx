import React from 'react';
import { Fab } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export const EditButton: React.VFC = () => {
  return (
    <Fab
      color="primary"
      size="small"
      sx={{
        position: 'sticky',
        top: (theme) => (theme.mixins.toolbar.minHeight! as number) + 20,
        marginRight: 2,
        zIndex: (theme) => theme.zIndex.editButton,
      }}
    >
      <EditIcon />
    </Fab>
  );
};
EditButton.displayName = 'EditButton';
