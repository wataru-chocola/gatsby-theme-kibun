import React from 'react';

import { alpha } from '@mui/material/styles';
import { Box, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const SearchBox = React.forwardRef<HTMLInputElement>((_props, ref) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: 42,
        borderColor: (theme) => alpha(theme.palette.common.black, 0.25),
        '&:hover': {
          borderColor: (theme) => alpha(theme.palette.common.black, 0.5),
        },
        padding: 0,
        width: { sm: 'auto', xs: '100%' },
      }}
    >
      <InputBase
        placeholder="Search..."
        size="small"
        sx={{
          color: (theme) => theme.palette.text.primary,
          fontSize: '14px',
          flex: 1,
          '& .MuiInputBase-input': {
            padding: 1,
            // vertical padding + font size from searchIcon
            paddingLeft: '2em',
            paddingRight: (theme) => `calc(1em + ${theme.spacing(4)})`,
            transition: (theme) => theme.transitions.create('width'),
            width: {
              xs: '100%',
              md: '20ch',
            },
          },
        }}
        inputProps={{ 'aria-label': 'search' }}
        ref={ref}
      />
      <IconButton
        sx={{
          position: 'absolute',
          top: '50%',
          right: '1%',
          transform: 'translateY(-50%)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: (theme) => theme.palette.primary.tint[1],
          padding: 0.5,
          color: 'primary.main',
          transition: (theme) =>
            theme.transitions.create(['background-color', 'color'], {
              duration: theme.transitions.duration.standard,
            }),
          '&:hover': {
            color: 'white',
            backgroundColor: (theme) => theme.palette.primary.main,
          },
        }}
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );
});
SearchBox.displayName = 'SearchBox';
