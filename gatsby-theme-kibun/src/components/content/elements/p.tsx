import React from 'react';
import { Typography } from '@mui/material';

export const P: React.FC = (props: any) => (
  <Typography variant="body1" component="p" {...props} paragraph></Typography>
);
P.displayName = 'P';
