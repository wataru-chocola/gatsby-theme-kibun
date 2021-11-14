import React from 'react';

import { alpha } from '@mui/material/styles';
import { Box, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const SearchBox = React.forwardRef<HTMLInputElement>((_props, ref) => {
  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 2,
        backgroundColor: (theme) => alpha(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: (theme) => alpha(theme.palette.common.white, 0.25),
        },
        marginRight: 2,
        marginLeft: { sm: 3, xs: 0 },
        width: { sm: 'auto', xs: '100%' },
      }}
    >
      <Box
        sx={{
          padding: 2,
          height: '100%',
          position: 'absolute',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SearchIcon />
      </Box>
      <InputBase
        placeholder="Search..."
        sx={{
          color: 'inherit',
          '& .MuiInputBase-input': {
            padding: 1,
            // vertical padding + font size from searchIcon
            paddingLeft: (theme) => `calc(1em + ${theme.spacing(4)})`,
            transition: (theme) => theme.transitions.create('width'),
            width: {
              sx: '100%',
              md: '20ch',
            },
          },
        }}
        inputProps={{ 'aria-label': 'search' }}
        ref={ref}
      />
    </Box>
  );
});
SearchBox.displayName = 'SearchBox';
