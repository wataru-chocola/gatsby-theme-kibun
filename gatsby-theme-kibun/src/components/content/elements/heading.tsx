import React from 'react';
import { Typography, styled } from '@mui/material';

const HeadingTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  borderColor: theme.palette.primary.main,
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(3),
  lineHeight: 1.2,

  'h1+&,h2+&,h3+&,h4+&,h5+&,h6+&': {
    marginTop: theme.spacing(4),
  },

  ':hover .auto-headers svg': {
    visibility: 'visible',
  },
  '.auto-headers': {
    display: 'inline-block',
    '@media not all and (hover: hover)': {
      display: 'none',
    },
    marginLeft: '0.3em',
    paddingX: 0.5,

    svg: {
      fill: '#77a8d2',
      visibility: 'hidden',
      width: '0.8em',
      height: '0.8em',
    },

    ':hover': {
      backgroundColor: '#d1e2f0',
      svg: {
        visibility: 'visible',
      },
    },

    ':focus svg': {
      visibility: 'visible',
    },
  },
}));

export const H1: React.FC = (props: any) => (
  <HeadingTypography variant="h1" component="h1" {...props} />
);
H1.displayName = 'H1';

export const H2 = styled((props: any) => (
  <HeadingTypography variant="h2" component="h2" {...props} />
))(({ theme }) => ({
  paddingTop: theme.spacing(0.5),
  paddingLeft: '0.5em',
  borderLeft: '4px solid',
}));
H2.displayName = 'H2';

export const H3: React.FC = (props: any) => (
  <HeadingTypography variant="h3" component="h3" {...props} />
);
H3.displayName = 'H3';

export const H4 = styled((props: any) => (
  <HeadingTypography variant="h4" component="h4" {...props} />
))({
  borderBottom: '1px solid',
});
H4.displayName = 'H4';

export const H5 = styled((props: any) => (
  <HeadingTypography variant="h5" component="h5" {...props} />
))(({ theme }) => ({
  color: theme.palette.secondary.main,
}));
H5.displayName = 'H5';

export const H6 = styled((props: any) => (
  <HeadingTypography variant="h6" component="h6" {...props} />
))(({ theme }) => ({
  color: theme.palette.secondary.shade[0],
}));
H6.displayName = 'H6';
