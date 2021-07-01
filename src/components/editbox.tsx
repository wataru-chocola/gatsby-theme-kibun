import React from 'react';

import { IconButton, Tooltip, TextField } from '@material-ui/core';
import PlayArrow from '@material-ui/icons/PlayArrow';
import CloseIcon from '@material-ui/icons/Close';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { Box, Paper, Grid } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  editBox: {
    position: 'sticky',
    [theme.breakpoints.down('md')]: {
      top: theme.mixins.toolbar.minHeight as number,
    },
    [theme.breakpoints.up('md')]: {
      top: (theme.mixins.toolbar.minHeight as number) + theme.spacing(1),
    },
    zIndex: theme.zIndex.appBar,
  },
  editInputField: {
    backgroundColor: 'white',
    [`& fieldset`]: {
      borderRadius: 0,
    },
  },
  editButtons: {
    [theme.breakpoints.up('md')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    justifyContent: 'flex-end',
  },
}));

interface EditBoxProps {
  closeEditmode: () => void;
  saveMarkdown: (markdown: string) => void;
  renderMarkdown: (markdown: string) => void;
  md?: string;
}

const EditBox: React.VFC<EditBoxProps> = ({ closeEditmode, saveMarkdown, renderMarkdown, md }) => {
  const inputEl = React.useRef<null | HTMLDivElement>(null);
  const [markdown, setMarkdown] = React.useState(md || '');
  const classes = useStyles();

  const saveEditing = React.useCallback(() => {
    saveMarkdown(markdown);
    renderMarkdown(markdown);
    closeEditmode();
  }, [saveMarkdown, closeEditmode, renderMarkdown, markdown]);
  const cancelEditing = React.useCallback(() => {
    renderMarkdown(md || '');
    closeEditmode();
  }, [closeEditmode, renderMarkdown, md]);
  const updateMarkdown = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMarkdown(e.target.value);
    },
    [setMarkdown],
  );
  const previewRenderedHTML = () => {
    renderMarkdown(markdown);
  };

  const buttons = [
    <Tooltip title="cancel" aria-label="cancel" key="cancel">
      <IconButton color="secondary" onClick={cancelEditing}>
        <CloseIcon />
      </IconButton>
    </Tooltip>,
    <Tooltip title="preview" aria-label="preview" key="preview">
      <IconButton color="primary" onClick={previewRenderedHTML}>
        <PlayArrow />
      </IconButton>
    </Tooltip>,
    <Tooltip title="save" aria-label="save" key="save">
      <IconButton color="primary" onClick={saveEditing}>
        <SaveAltIcon />
      </IconButton>
    </Tooltip>,
  ];

  return (
    <Paper className={classes.editBox} square elevation={4}>
      <Box p={0}>
        <Grid container spacing={0}>
          <Grid item xs={12} md>
            <TextField
              className={classes.editInputField}
              variant="outlined"
              multiline
              fullWidth
              rows={10}
              ref={inputEl}
              value={markdown}
              onChange={updateMarkdown}
            ></TextField>
          </Grid>
          <Grid container item md={1} className={classes.editButtons}>
            {buttons.map((e, i) => (
              <Grid item key={i}>
                {e}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default EditBox;
