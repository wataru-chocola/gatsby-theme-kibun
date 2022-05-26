import React from 'react';

import { IconButton, Tooltip, TextField } from '@mui/material';
import PlayArrow from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

import { EditBoxLayout } from './editboxLayout';

import { useAppSelector, useAppDispatch } from '../../state/hooks';
import { selectIsLoggedIn } from '../../state/loginSelector';
import {
  selectGithubUpdateMarkdownState,
  selectGithubGetMarkdownResult,
} from '../../state/githubAPISelector';
import { githubAPIActions } from '../../state/githubAPISlice';

import { useGithubRepoOperator } from '../../hooks/useGithubRepoOperator';

interface EditBoxProps {
  closeEditmode: () => void;
  saveMarkdown: (markdown: string) => void;
  renderMarkdown: (markdown: string) => void;
  resetMarkdown: () => void;
  srcPath: string;
  md?: string;
  frontmatter?: string;
}

export const EditBox = React.forwardRef<HTMLDivElement, EditBoxProps>(
  (
    { closeEditmode, saveMarkdown, renderMarkdown, resetMarkdown, srcPath, md, frontmatter },
    forwardedRef,
  ) => {
    const inputEl = React.useRef<null | HTMLDivElement>(null);
    const [markdown, setMarkdown] = React.useState(md || '');

    const updatingState = useAppSelector((state) => selectGithubUpdateMarkdownState(state));
    const gettingMarkdownResult = useAppSelector((state) => selectGithubGetMarkdownResult(state));
    const isLoggedIn = useAppSelector((state) => selectIsLoggedIn(state));

    const dispatch = useAppDispatch();
    const github = useGithubRepoOperator();

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

    return (
      <EditBoxLayout
        ref={forwardedRef}
        cancelBtn={
          <Tooltip title="cancel" aria-label="cancel" key="cancel">
            <IconButton color="secondary" onClick={cancelEditing} size="large">
              <CloseIcon />
            </IconButton>
          </Tooltip>
        }
        previewBtn={
          <Tooltip title="preview" aria-label="preview" key="preview">
            <IconButton color="primary" onClick={previewRenderedHTML} size="large">
              <PlayArrow />
            </IconButton>
          </Tooltip>
        }
        saveBtn={
          <Tooltip title="save" aria-label="save" key="save">
            <IconButton
              color="primary"
              onClick={saveEditing}
              disabled={updatingState === 'progress'}
              size="large"
            >
              <SaveAltIcon />
            </IconButton>
          </Tooltip>
        }
      >
        <TextField
          variant="outlined"
          inputProps={{
            'aria-label': 'markdown source',
          }}
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
      </EditBoxLayout>
    );
  },
);
EditBox.displayName = 'EditBox';

export default EditBox;
