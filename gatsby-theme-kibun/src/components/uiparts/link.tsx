import React from 'react';
import { GatsbyLink } from '../../utils/link';
import { Link, LinkProps } from '@mui/material';

export const MuiGatsbyLink = React.forwardRef<HTMLAnchorElement, LinkProps & { to?: string }>(
  (props, ref) => {
    const { to } = props;
    return to ? (
      <Link
        color="secondary"
        ref={ref}
        component={GatsbyLink}
        underline="none"
        to={to}
        sx={{
          '&:hover': {
            backgroundColor: 'secondary.main',
            color: 'white',
          },
        }}
        {...props}
      />
    ) : (
      <Link color="secondary" ref={ref} underline="hover" {...props} />
    );
  },
);
MuiGatsbyLink.displayName = 'MuiGatsbyLink';
