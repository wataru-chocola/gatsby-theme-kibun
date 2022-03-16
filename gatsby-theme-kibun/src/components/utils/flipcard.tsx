import React from 'react';
import { Box } from '@mui/material';

interface FlipcardPros {
  reversed: boolean;
  front: React.ReactChild;
  back: React.ReactChild;
}

export const Flipcard: React.VFC<FlipcardPros> = (props) => {
  return (
    <Box
      sx={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        transition: 'all 0.4s ease-in-out',
        backfaceVisibility: 'hidden',
        transform: () => (props.reversed ? 'rotateX(180deg)' : 'none'),
      }}
    >
      <Box>{props.front}</Box>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: 'rotateX(180deg)',
          backfaceVisibility: 'hidden',
        }}
      >
        {props.back}
      </Box>
    </Box>
  );
};
