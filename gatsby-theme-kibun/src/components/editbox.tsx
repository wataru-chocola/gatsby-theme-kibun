import React from 'react';

import { IconButton, Tooltip, TextField } from '@material-ui/core';
import PlayArrow from '@material-ui/icons/PlayArrow';
import CloseIcon from '@material-ui/icons/Close';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { Box, Paper, Grid } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { useAppSelector, useAppDispatch } from '../state/hooks';
import { selectIsLoggedIn } from '../state/loginSelector';
import {
  selectGithubUpdateMarkdownError,
  selectGithubUpdateMarkdownState,
} from '../state/githubAPISelector';
import { githubAPIActions } from '../state/githubAPISlice';
import { snackMessageActions } from '../state/snackMessageSlice';

import { splitFrontmatter } from '../utils/markdown/markdownParser';

import { useGithubRepoOperator } from '../hooks/useGithubRepoOperator';

const useStyles = makeStyles((theme: Theme) => ({
  editBox: {
    position: 'sticky',
    [theme.breakpoints.down('sm')]: {
      top: theme.mixins.toolbar.minHeight as number,
    },
    [theme.breakpoints.up('md')]: {
      top: (theme.mixins.toolbar.minHeight as number) + theme.spacing(1),
    },
    zIndex: theme.zIndex.appBar,
    backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'><path fill='%239C92AC' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'></path></svg>")`,
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
  resetMarkdown: () => void;
  srcPath: string;
  md?: string;
  frontmatter?: string;
}

export const EditBoxMonitor: React.VFC = () => {
  const dispatch = useAppDispatch();
  const updatingState = useAppSelector((state) => selectGithubUpdateMarkdownState(state));
  const updatingError = useAppSelector((state) => selectGithubUpdateMarkdownError(state));

  React.useEffect(() => {
    switch (updatingState) {
      case 'progress':
        dispatch(snackMessageActions.setMessage({ message: 'saving changes' }));
        break;
      case 'succeeded':
        dispatch(snackMessageActions.hideMessage({}));
        dispatch(
          snackMessageActions.setMessage({
            message: 'success!',
            severity: 'success',
            autoHideDuration: 2000,
          }),
        );
        break;
      case 'failed':
        console.error(updatingError);
        dispatch(snackMessageActions.hideMessage({}));
        dispatch(
          snackMessageActions.addErrorMessage(
            updatingError,
            3000,
            'failed to update github content: ',
          ),
        );
    }
  }, [dispatch, updatingState, updatingError]);

  return null;
};
EditBoxMonitor.displayName = 'EditBoxMonitor';

export const EditBox = React.forwardRef<HTMLDivElement, EditBoxProps>(
  (
    { closeEditmode, saveMarkdown, renderMarkdown, resetMarkdown, srcPath, md, frontmatter },
    forwardedRef,
  ) => {
    const inputEl = React.useRef<null | HTMLDivElement>(null);
    const [markdown, setMarkdown] = React.useState(md || '');
    const classes = useStyles();
    const innerRef = React.useRef<HTMLDivElement>();

    const updatingState = useAppSelector((state) => selectGithubUpdateMarkdownState(state));
    const isLoggedIn = useAppSelector((state) => selectIsLoggedIn(state));
    const dispatch = useAppDispatch();
    const github = useGithubRepoOperator();

    React.useImperativeHandle(forwardedRef, () => innerRef.current!);

    React.useLayoutEffect(() => {
      const editBoxHeight = innerRef?.current?.scrollHeight;
      if (editBoxHeight != null) {
        window.scrollBy(0, editBoxHeight);
      }
      return () => {
        editBoxHeight && window.scrollBy(0, -editBoxHeight);
      };
    }, []);

    React.useEffect(() => {
      if (isLoggedIn) {
        github
          .getFileContent(srcPath)
          .then((content) => {
            const tmpContent = splitFrontmatter(content);
            if (tmpContent[1] !== markdown) {
              console.log('detect diff');
            }
          })
          .catch((e) => {
            console.error(e);
            dispatch(snackMessageActions.hideMessage({}));
            dispatch(
              snackMessageActions.addErrorMessage(e, 3000, 'failed to fetch content source: '),
            );
          });
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const saveEditing = React.useCallback(() => {
      if (markdown !== md && isLoggedIn) {
        dispatch(
          githubAPIActions.updateMarkdown({
            github: github,
            path: srcPath,
            frontmatter: frontmatter || '',
            markdown: markdown,
          }),
        );
      }

      saveMarkdown(markdown);
      closeEditmode();
    }, [
      saveMarkdown,
      closeEditmode,
      markdown,
      frontmatter,
      github,
      isLoggedIn,
      md,
      srcPath,
      dispatch,
    ]);
    const cancelEditing = React.useCallback(() => {
      resetMarkdown();
      closeEditmode();
    }, [closeEditmode, resetMarkdown]);

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
        <IconButton color="primary" onClick={saveEditing} disabled={updatingState === 'progress'}>
          <SaveAltIcon />
        </IconButton>
      </Tooltip>,
    ];

    return (
      <Paper className={classes.editBox} square elevation={4} ref={innerRef}>
        <Box p={0} pt={2}>
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
  },
);
EditBox.displayName = 'EditBox';

export default EditBox;
