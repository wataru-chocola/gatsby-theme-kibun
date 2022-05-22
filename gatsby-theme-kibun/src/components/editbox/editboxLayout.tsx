import React from 'react';

import { Box, Paper, Grid } from '@mui/material';

interface EditBoxLayoutProps {
  cancelBtn: React.ReactElement;
  saveBtn: React.ReactElement;
  previewBtn: React.ReactElement;
  children: React.ReactElement;
}

export const EditBoxLayout = React.forwardRef<HTMLDivElement, EditBoxLayoutProps>(
  ({ cancelBtn, saveBtn, previewBtn, children }, forwardedRef) => {
    const innerRef = React.useRef<HTMLDivElement | null>(null);
    React.useImperativeHandle(forwardedRef, () => innerRef.current!);

    React.useLayoutEffect(() => {
      const editBoxHeight = innerRef?.current?.scrollHeight;
      if (editBoxHeight != null) {
        window.scrollBy(0, editBoxHeight);
      }
      return () => {
        editBoxHeight && window.scrollBy(0, -editBoxHeight);
      };
    });

    return (
      <Paper
        square
        elevation={4}
        ref={innerRef}
        sx={{
          position: 'sticky',
          top: (theme) => ({
            xs: `${theme.mixins.toolbar.minHeight!}px`,
            md: `${
              (theme.mixins.toolbar.minHeight as number) + Number(theme.spacing(1).slice(0, -2))
            }px`,
          }),
          zIndex: (theme) => theme.zIndex.editBox,
          backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'><path fill='%239C92AC' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'></path></svg>")`,
        }}
      >
        <Box p={0} pt={2}>
          <Grid container spacing={0}>
            <Grid item xs={12} md>
              {children}
            </Grid>
            <Grid
              container
              item
              md={1}
              sx={{
                flexDirection: {
                  md: 'column',
                },
                alignItems: {
                  md: 'center',
                },
                justifyContent: 'flex-end',
              }}
            >
              <Grid item key="cancel">
                {cancelBtn}
              </Grid>
              <Grid item key="preview">
                {previewBtn}
              </Grid>
              <Grid item key="save">
                {saveBtn}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    );
  },
);
EditBoxLayout.displayName = 'EditBoxLayout';
