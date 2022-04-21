import React from 'react';
import { Fab } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

type Props = {
  onClick: () => void;
};
export const EditButton: React.VFC<Props> = (props) => {
  return (
    <Fab
      color="primary"
      size="small"
      onClick={props.onClick}
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
