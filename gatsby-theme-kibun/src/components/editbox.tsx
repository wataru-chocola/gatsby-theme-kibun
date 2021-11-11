import React from 'react';

import { IconButton, Tooltip, TextField } from '@mui/material';
import PlayArrow from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { Box, Paper, Grid } from '@mui/material';

import { useAppSelector, useAppDispatch } from '../state/hooks';
import { selectIsLoggedIn } from '../state/loginSelector';
import {
  selectGithubUpdateMarkdownError,
  selectGithubUpdateMarkdownState,
  selectGithubGetMarkdownState,
  selectGithubGetMarkdownError,
  selectGithubGetMarkdownResult,
} from '../state/githubAPISelector';
import { githubAPIActions } from '../state/githubAPISlice';
import { snackMessageActions } from '../state/snackMessageSlice';

import { useGithubRepoOperator } from '../hooks/useGithubRepoOperator';

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
  const gettingState = useAppSelector((state) => selectGithubGetMarkdownState(state));
  const gettingError = useAppSelector((state) => selectGithubGetMarkdownError(state));

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

  React.useEffect(() => {
    switch (gettingState) {
      case 'failed':
        console.error(gettingError);
        dispatch(snackMessageActions.hideMessage({}));
        dispatch(
          snackMessageActions.addErrorMessage(
            gettingError,
            3000,
            'failed to fetch content source: ',
          ),
        );
    }
  }, [dispatch, gettingState, gettingError]);

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
    const innerRef = React.useRef<HTMLDivElement | null>(null);

    const updatingState = useAppSelector((state) => selectGithubUpdateMarkdownState(state));
    const gettingMarkdownResult = useAppSelector((state) => selectGithubGetMarkdownResult(state));
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
        dispatch(githubAPIActions.getMarkdown({ github: github, path: srcPath }));
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect(() => {
      if (gettingMarkdownResult != null && gettingMarkdownResult !== markdown) {
        console.log('detect diff');
      }
    }, [gettingMarkdownResult]); // eslint-disable-line react-hooks/exhaustive-deps

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
    const previewRenderedHTML = React.useCallback(() => {
      renderMarkdown(markdown);
    }, [renderMarkdown, markdown]);

    const buttons = [
      <Tooltip title="cancel" aria-label="cancel" key="cancel">
        <IconButton color="secondary" onClick={cancelEditing} size="large">
          <CloseIcon />
        </IconButton>
      </Tooltip>,
      <Tooltip title="preview" aria-label="preview" key="preview">
        <IconButton color="primary" onClick={previewRenderedHTML} size="large">
          <PlayArrow />
        </IconButton>
      </Tooltip>,
      <Tooltip title="save" aria-label="save" key="save">
        <IconButton
          color="primary"
          onClick={saveEditing}
          disabled={updatingState === 'progress'}
          size="large"
        >
          <SaveAltIcon />
        </IconButton>
      </Tooltip>,
    ];

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
          zIndex: 'appBar',
          backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'><path fill='%239C92AC' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'></path></svg>")`,
        }}
      >
        <Box p={0} pt={2}>
          <Grid container spacing={0}>
            <Grid item xs={12} md>
              <TextField
                variant="outlined"
                multiline
                fullWidth
                rows={10}
                ref={inputEl}
                value={markdown}
                onChange={updateMarkdown}
                sx={{
                  backgroundColor: 'white',
                  [`& fieldset`]: {
                    borderRadius: 0,
                  },
                }}
              ></TextField>
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
